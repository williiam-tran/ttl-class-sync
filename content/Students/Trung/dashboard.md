<%*
// Helper function for number suffix
function getNumberSuffix(num) {
    if (num >= 11 && num <= 13) return "th";
    const lastDigit = num % 10;
    switch (lastDigit) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

// Get student name from the file path
const studentsPath = "Languages/English/Tutoring/TTL Class/Students";
const students = await app.vault.adapter.list(studentsPath);

// Extract just the student names from the full paths
const studentNames = students.folders
    .map(path => path.split('/').pop())
    .filter(name => name);

console.log("Available students:", studentNames);

// Let user select student
const selectedStudent = await tp.system.suggester(
    name => name,
    studentNames
);

if (!selectedStudent) {
    console.log("No student selected");
    return;
}

// Get session number from existing files
const sessionsPath = `${studentsPath}/${selectedStudent}/Sessions`;
const sessions = await app.vault.adapter.list(sessionsPath);
const sessionNum = sessions.files.length + 1;
const suffix = getNumberSuffix(sessionNum);

// Try to read student profile
let profileData = {};
try {
    const profilePath = `${studentsPath}/${selectedStudent}/student-profile.md`;
    const profile = await app.vault.adapter.read(profilePath);
    const profileContent = profile.split('---');
    if (profileContent.length >= 2) {
        profileData = yaml.parse(profileContent[1].trim());
    }
} catch (e) {
    console.error("Error reading profile:", e);
}

// Default values if profile data is missing
const level = profileData.level || 'beginner';
const courseId = profileData.canvas_course_id || '10789406';

// Questions based on level
const questions = {
    'beginner': {
        question: "Which sentence is grammatically correct?",
        answers: [
            "I am go to school",
            "I am going to school",
            "I going to school",
            "I go to school yesterday"
        ],
        correct: 1
    },
    'intermediate': {
        question: "Choose the correct present perfect form:",
        answers: [
            "I have been seeing him yesterday",
            "I have seen him yesterday",
            "I have seen him recently",
            "I seen him yesterday"
        ],
        correct: 2
    },
    'advanced': {
        question: "Select the most appropriate response:",
        answers: [
            "Had I known earlier, I would have helped",
            "If I would know earlier, I would help",
            "If I knew earlier, I would helped",
            "Had I knew earlier, I would help"
        ],
        correct: 0
    }
};

const levelQ = questions[level] || questions.beginner;

const essayPrompts = {
    'beginner': "Describe your daily routine using simple present tense.",
    'intermediate': "Compare and contrast your life now with your life five years ago.",
    'advanced': "Discuss the implications of artificial intelligence on modern education."
};

// Create new file path
const newFilePath = `${sessionsPath}/${sessionNum}${suffix}.md`;
await tp.file.move(newFilePath);

// Generate the content
let content = `---
canvas_course_id: ${courseId}
canvas_sync: true
due_date: ${moment().add(2, 'weeks').format('YYYY-MM-DDTHH:mm:ssZ')}
points_possible: 100
session_number: ${sessionNum}
student: ${selectedStudent}
---

## Description
    Session ${sessionNum} for ${selectedStudent} (${level} level)
`;

if (profileData.goals) {
    content += `    Focus areas based on student profile:\n`;
    profileData.goals.forEach(goal => {
        content += `    - ${goal}\n`;
    });
}

content += `
### Question 1
Type: multiple_choice
Points: 5
Question: ${levelQ.question}
`;

levelQ.answers.forEach((answer, i) => {
    content += `- ${i === levelQ.correct ? '[x]' : '[ ]'} ${answer}\n`;
});

content += `
### Question 2
Type: essay
Points: 10
Question: ${essayPrompts[level] || essayPrompts.beginner}
`;

tR += content;
-%>