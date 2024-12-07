---
student: {{student_name}}
start_date: {{start_date}}
level: {{level}}
goals: {{goals}}
publish: true
---

# Student Dashboard - {{student_name}}

## Quick Links
- [[Student Profile - {{student_name}}]]
- [[Current Materials - {{student_name}}]]
- [[Assessment History - {{student_name}}]]

## Current Progress Overview
![[progress-chart-{{student_name}}]]

## Recent Sessions
```dataview
TABLE date, session_number, duration
FROM "English/Tutoring/TTL Class/Students/{{student_name}}/Sessions"
SORT date DESC
LIMIT 5
```

## Weekly Reviews
```dataview
TABLE week, date_range
FROM "English/Tutoring/TTL Class/Students/{{student_name}}/Weekly-Reviews"
SORT date DESC
LIMIT 4
```

## Current Learning Materials
- 

## Active Goals
- [ ] 

## Notes & Reminders
- 

## PDF Materials & Resources
- 

## Tags
#student-dashboard #{{student_name}} #ttl-class 

## Canvas Sync Status
```dataview
TABLE sync_status, last_sync
FROM "English/Tutoring/TTL Class/Students/{{student_name}}/Sessions"
WHERE canvas_sync = true
SORT date DESC
LIMIT 5

```