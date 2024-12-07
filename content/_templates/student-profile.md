---
student: {{student_name}}
canvas_user_id: {{canvas_user_id}}
start_date: {{start_date}}
level: {{level}}
goals: {{goals}}
publish: true
---

# Student Profile - {{student_name}}

## Personal Information
- **Level:** {{level}}
- **Start Date:** {{start_date}}
- **Canvas ID:** {{canvas_user_id}}

## Learning Goals
- 

## Assessment History
```dataview
TABLE grade, status
FROM "English/Tutoring/TTL Class/Students/{{student_name}}/Canvas-Sync"
SORT file.ctime DESC
LIMIT 5
```

## Progress Overview
### Current Level Assessment
- Speaking: 
- Listening: 
- Reading: 
- Writing: 

### Strengths
- 

### Areas for Development
- 

## Learning Style
- 

## Preferred Materials
- 

## Notes
- 

## Canvas Integration
- Course ID: {{course_id}}
- Last Assessment: {{last_assessment_date}}

## Tags
#student-profile #{{student_name}} #ttl-class 