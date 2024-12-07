import os
import json
import yaml
import logging
from datetime import datetime
from canvasapi import Canvas
from pathlib import Path
from dotenv import load_dotenv

# Set up logging to both file and console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('canvas_sync.log'),
        logging.StreamHandler()  # This will print to console
    ]
)
logger = logging.getLogger(__name__)

class CanvasObsidianSync:
    def __init__(self, api_url, api_key, vault_path):
        self.canvas = Canvas(api_url, api_key)
        self.vault_path = Path(vault_path)
        self.config = self._load_config()

    def _load_config(self):
        config_path = self.vault_path / 'scripts' / 'config.json'
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {}

    def _get_frontmatter(self, file_path):
        """Extract YAML frontmatter from Obsidian note"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if content.startswith('---'):
                _, fm, _ = content.split('---', 2)
                return yaml.safe_load(fm)
        return {}

    def _get_note_content(self, file_path):
        """Get note content without frontmatter"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if content.startswith('---'):
                _, _, content = content.split('---', 2)
            return content.strip()

    def _parse_quiz_questions(self, content):
        """Parse quiz questions from markdown content"""
        questions = []
        current_question = None
        
        for line in content.split('\n'):
            if line.startswith('### Question'):
                if current_question:
                    # Format the question according to Canvas API specs
                    formatted_question = {
                        'question_name': f"Question {len(questions) + 1}",
                        'question_text': current_question.get('question_text', ''),
                        'question_type': current_question.get('question_type', 'multiple_choice_question'),
                        'points_possible': current_question.get('points', 5),
                        'answers': []
                    }
                    
                    # Format answers according to Canvas API specs
                    for answer in current_question.get('answers', []):
                        formatted_question['answers'].append({
                            'answer_text': answer['text'],
                            'answer_weight': answer['weight']
                        })
                    
                    questions.append(formatted_question)
                current_question = {'answers': []}
            
            elif current_question:
                if line.startswith('Type: '):
                    qtype = line.split(': ')[1].strip()
                    # Map our question types to Canvas question types
                    type_mapping = {
                        'multiple_choice': 'multiple_choice_question',
                        'essay': 'essay_question',
                        'true_false': 'true_false_question',
                        'short_answer': 'short_answer_question'
                    }
                    current_question['question_type'] = type_mapping.get(qtype, 'multiple_choice_question')
                elif line.startswith('Points: '):
                    current_question['points'] = int(line.split(': ')[1])
                elif line.startswith('Question: '):
                    current_question['question_text'] = line.split(': ')[1]
                elif line.startswith('- ['):
                    # Multiple choice option
                    is_correct = 'x' in line[3]
                    answer_text = line[line.find(']')+1:].strip()
                    current_question['answers'].append({
                        'text': answer_text,
                        'weight': 100 if is_correct else 0
                    })
        
        # Don't forget the last question
        if current_question:
            formatted_question = {
                'question_name': f"Question {len(questions) + 1}",
                'question_text': current_question.get('question_text', ''),
                'question_type': current_question.get('question_type', 'multiple_choice_question'),
                'points_possible': current_question.get('points', 5),
                'answers': []
            }
            
            for answer in current_question.get('answers', []):
                formatted_question['answers'].append({
                    'answer_text': answer['text'],
                    'answer_weight': answer['weight']
                })
            
            questions.append(formatted_question)
        
        return questions

    def _get_description(self, content):
        """Extract description from content (only the text under ## Description)"""
        description = ""
        in_description = False
        
        for line in content.split('\n'):
            if line.startswith('## Description'):
                in_description = True
            elif line.startswith('##') and in_description:
                break
            elif in_description:
                description += line + '\n'
    
        return description.strip()
                
    def _get_student_info(self, student_name):
        """Get student info from their profile"""
        profile_path = self.vault_path / "Students" / student_name / "student-profile.md"
        if profile_path.exists():
            fm = self._get_frontmatter(profile_path)
            return {
                'canvas_user_id': fm.get('canvas_user_id'),
                'level': fm.get('level', 'beginner'),
                'start_date': fm.get('start_date')
            }
        return None

    def sync_session_to_canvas(self, session_note_path):
        """Sync daily session notes to Canvas quizzes"""
        logger.info(f"Starting sync for session: {session_note_path}")
        
        try:
            fm = self._get_frontmatter(session_note_path)
            if not fm.get('canvas_sync'):
                logger.info("canvas_sync not enabled in frontmatter, skipping")
                return
            
            # Get student info
            student_name = fm.get('student')
            student_info = self._get_student_info(student_name)
            if not student_info:
                logger.error(f"Student profile not found for {student_name}")
                return
            
            content = self._get_note_content(session_note_path)
            description = self._get_description(content)
            
            course_id = fm.get('canvas_course_id') or os.getenv('CANVAS_COURSE_ID')
            if not course_id:
                logger.error("No course ID found in frontmatter or environment")
                return
            
            course = self.canvas.get_course(course_id)
            
            # Get or create assignment group for the student
            assignment_group_id = fm.get('canvas_assignment_group_id')
            if not assignment_group_id:
                group_name = f"Quizzes - {student_name}"
                
                # Get all assignment groups and check for existing one
                existing_groups = course.get_assignment_groups()
                existing_group = next(
                    (group for group in existing_groups if group.name == group_name),
                    None
                )
                
                if existing_group:
                    assignment_group_id = existing_group.id
                    logger.info(f"Found existing assignment group {group_name} with ID {assignment_group_id}")
                else:
                    # Create new group if none exists
                    assignment_group = course.create_assignment_group(
                        name=group_name,
                        position=1
                    )
                    assignment_group_id = assignment_group.id
                    logger.info(f"Created new assignment group {group_name} with ID {assignment_group_id}")
            
            logger.info(f"Current student name: {student_name}")

            # Prepare quiz data
            quiz_data = {
                'title': f"Session {fm.get('session_number', 'Untitled')} - {student_name}",
                'description': description,
                'quiz_type': 'assignment',
                'points_possible': fm.get('points_possible', 100),
                'published': True,
                'show_correct_answers': True,
                'allowed_attempts': -1,
                'scoring_policy': 'keep_highest',
                'assignment_group_id': assignment_group_id,
                'only_visible_to_overrides': True
            }
            
            if 'due_date' in fm:
                quiz_data['due_at'] = fm['due_date']
                logger.info(f"Setting due date to {fm['due_date']}")
            
            # Create or update quiz
            if 'canvas_quiz_id' in fm:
                quiz_id = fm['canvas_quiz_id']
                logger.info(f"Updating existing quiz {quiz_id}")
                quiz = course.get_quiz(quiz_id)
                quiz = quiz.edit(quiz=quiz_data)
            else:
                logger.info("Creating new quiz")
                quiz = course.create_quiz(quiz=quiz_data)
            
            # Get the corresponding assignment for the quiz
            assignment = course.get_assignment(quiz.assignment_id)
            logger.info(f"Got corresponding assignment {assignment.id} for quiz {quiz.id}")
            
            # Check for existing assignment overrides
            existing_overrides = assignment.get_overrides()
            student_override = next((o for o in existing_overrides if student_info['canvas_user_id'] in o.student_ids), None)
            
            if student_override:
                logger.info(f"Updating existing override {student_override.id} for student {student_name}")
                # Update the existing override
                override_data = {
                    'student_ids': [student_info['canvas_user_id']],
                    'title': f"Override for {student_name}"
                }
                if 'due_date' in fm:
                    override_data['due_at'] = fm['due_date']
                
                student_override.edit(**override_data)
            else:
                logger.info(f"Creating new override for student {student_name}")
                # Create a new override
                override_data = {
                    'assignment_override': {
                        'student_ids': [student_info['canvas_user_id']],
                        'title': f"Override for {student_name}"
                    }
                }
                if 'due_date' in fm:
                    override_data['assignment_override']['due_at'] = fm['due_date']
                
                assignment.create_override(**override_data)
            
            # Update questions
            questions = self._parse_quiz_questions(content)
            existing_questions = list(quiz.get_questions())
            
            for question in existing_questions:
                question.delete()
            
            for question_data in questions:
                try:
                    quiz.create_question(question=question_data)
                except Exception as e:
                    logger.error(f"Failed to create question: {str(e)}")
            
            # Update frontmatter with sync status and IDs
            self._update_frontmatter(session_note_path, {
                'canvas_quiz_id': quiz.id,
                'canvas_url': quiz.html_url,
                'canvas_assignment_group_id': assignment_group_id,
                'canvas_assignment_id': quiz.assignment_id,
                'last_sync': datetime.now().isoformat(),
                'sync_status': 'completed'
            })
            
            logger.info(f"Successfully synced quiz {quiz.id} with assignment {quiz.assignment_id}")
            return quiz
        
        except Exception as e:
            logger.error(f"Error syncing session: {str(e)}", exc_info=True)
            self._update_frontmatter(session_note_path, {
                'last_sync': datetime.now().isoformat(),
                'sync_status': 'failed',
                'sync_error': str(e)
            })
            return None

    def _update_frontmatter(self, file_path, new_data):
        """Update YAML frontmatter in an Obsidian note"""
        logger.info(f"Updating frontmatter for {file_path}")
        try:
            # Read the entire file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Split the content
            if content.startswith('---'):
                _, fm_string, body = content.split('---', 2)
                # Parse existing frontmatter
                fm = yaml.safe_load(fm_string)
                
                # Update with new data
                fm.update(new_data)
                
                # Write back to file
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write('---\n')
                    f.write(yaml.dump(fm, allow_unicode=True))
                    f.write('---')
                    f.write(body)
                
                logger.info("Frontmatter updated successfully")
            else:
                # If no frontmatter exists, create it
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write('---\n')
                    f.write(yaml.dump(new_data, allow_unicode=True))
                    f.write('---\n')
                    f.write(content)
                
                logger.info("Created new frontmatter")
                
        except Exception as e:
            logger.error(f"Error updating frontmatter: {str(e)}")
            raise

def main():
    logger.info("Starting Canvas sync process")
    
    # Load .env from the same directory as this script
    script_dir = Path(__file__).parent
    env_path = script_dir / '.env'
    load_dotenv(env_path)
    
    # Get environment variables
    api_url = os.getenv('CANVAS_API_URL')
    api_key = os.getenv('CANVAS_API_KEY')
    vault_path = os.getenv('OBSIDIAN_VAULT_PATH')
    
    if not all([api_url, api_key, vault_path]):
        logger.error("Missing required environment variables")
        return

    # Check if a specific student is provided as an argument
    import sys
    student_names = ['Thanh', 'Minitung', 'Tlinh', 'Trung']
    week_index = 1
    if len(sys.argv) > 2:
        student_names = sys.argv[1].split(',')
        student_names = [name.strip() for name in student_names]
        week_index = int(sys.argv[2])
    
    try:
        logger.info("Initializing sync...")
        syncer = CanvasObsidianSync(api_url, api_key, vault_path)
        
        # Example: Sync all session notes for a specific student
        for student_name in student_names:
            student_sessions_path = Path(vault_path) / f"Students/{student_name}/Quizzes/Week {week_index}"
            if student_sessions_path.exists():
                logger.info(f"Scanning for session notes in: {student_sessions_path}")
                print(f"Scanning for session notes in: {student_sessions_path}")
                
                session_files = list(student_sessions_path.glob("*.md"))
                if not session_files:
                    logger.warning("No session files found")
                    print("Warning: No session files found")
                    continue
                
                for session_file in session_files:
                    logger.info(f"Processing session file: {session_file}")
                    print(f"Processing: {session_file}")
                    
                    # Verify file has required frontmatter before processing
                    try:
                        with open(session_file, 'r', encoding='utf-8') as f:
                            content = f.read()
                            if '---' not in content:
                                logger.error(f"File missing frontmatter: {session_file}")
                                continue
                                
                            # Basic frontmatter validation
                            fm = syncer._get_frontmatter(session_file)
                            required_fields = ['student', 'session_number', 'canvas_sync']
                            missing_fields = [field for field in required_fields if field not in fm]
                            
                            if missing_fields:
                                logger.error(f"Missing required frontmatter fields {missing_fields} in {session_file}")
                                continue
                            
                            syncer.sync_session_to_canvas(session_file)
                    except Exception as e:
                        logger.error(f"Error processing file {session_file}: {str(e)}")
                        continue
            else:
                error_msg = f"Sessions directory not found: {student_sessions_path}"
                logger.error(error_msg)
                print(f"Error: {error_msg}")
            
    except Exception as e:
        logger.error(f"Sync failed: {str(e)}", exc_info=True)
        print(f"Error during sync: {str(e)}")

if __name__ == '__main__':
    main() 