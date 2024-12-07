import os
import json
import shutil
from datetime import datetime
from pathlib import Path

class StudentSetup:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.templates_path = self.base_path / '_templates'
        self.config = self._load_config()

    def _load_config(self):
        config_path = self.base_path / 'scripts' / 'config.json'
        with open(config_path, 'r') as f:
            return json.load(f)

    def create_student_structure(self, student_name, canvas_user_id, level="beginner"):
        """Create the complete folder structure for a new student"""
        student_path = self.base_path / 'Students' / student_name
        
        # Create directories
        folders = ['Sessions', 'Weekly-Reviews', 'Materials', 'Canvas-Sync']
        for folder in folders:
            (student_path / folder).mkdir(parents=True, exist_ok=True)

        # Create student profile
        self._create_student_profile(student_path, student_name, canvas_user_id, level)
        
        # Create student dashboard
        self._create_student_dashboard(student_path, student_name)
        
        # Update config
        self._update_config(student_name, canvas_user_id, level)

    def _create_student_profile(self, student_path, student_name, canvas_user_id, level):
        """Create student profile from template"""
        template_path = self.templates_path / 'student-profile.md'
        profile_path = student_path / 'student-profile.md'
        
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Replace template variables
        content = template.replace('{{student_name}}', student_name)
        content = content.replace('{{canvas_user_id}}', canvas_user_id)
        content = content.replace('{{start_date}}', datetime.now().strftime('%Y-%m-%d'))
        content = content.replace('{{level}}', level)
        
        with open(profile_path, 'w', encoding='utf-8') as f:
            f.write(content)

    def _create_student_dashboard(self, student_path, student_name):
        """Create student dashboard from template"""
        template_path = self.templates_path / 'student-dashboard.md'
        dashboard_path = student_path / 'dashboard.md'
        
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        content = template.replace('{{student_name}}', student_name)
        content = content.replace('{{start_date}}', datetime.now().strftime('%Y-%m-%d'))
        
        with open(dashboard_path, 'w', encoding='utf-8') as f:
            f.write(content)

    def _update_config(self, student_name, canvas_user_id, level):
        """Update config.json with new student information"""
        self.config['obsidian']['students'][student_name] = {
            'canvas_user_id': canvas_user_id,
            'level': level
        }
        
        config_path = self.base_path / 'scripts' / 'config.json'
        with open(config_path, 'w') as f:
            json.dump(self.config, f, indent=4)

def main():
    # Example usage
    base_path = Path("F:\\Studycorner\\Obsidian\\Knowledge Base\\Languages\\English\\Tutoring\\TTL Class")
    setup = StudentSetup(base_path)
    
    # Get student information
    student_name = input("Enter student name: ")
    canvas_user_id = input("Enter Canvas user ID: ")
    level = input("Enter student level (beginner/intermediate/advanced): ")
    
    # Create student structure
    setup.create_student_structure(student_name, canvas_user_id, level)
    print(f"Created structure for student: {student_name}")

if __name__ == '__main__':
    main() 