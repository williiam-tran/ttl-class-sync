---
student: minitung
start_date: 2024-12-04
level: {{level}}
goals: {{goals}}
---

# Student Dashboard - minitung

## Quick Links
- [[Student Profile - minitung]]
- [[Current Materials - minitung]]
- [[Assessment History - minitung]]

## Current Progress Overview
![[progress-chart-minitung]]

## Recent Sessions
```dataview
TABLE date, session_number, duration
FROM "Languages/English/Tutoring/TTL Class/Students/minitung/Sessions"
SORT date DESC
LIMIT 5
```

## Weekly Reviews
```dataview
TABLE week, date_range
FROM "English/Tutoring/TTL Class/Students/minitung/Weekly-Reviews"
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
#student-dashboard #minitung #ttl-class 

## Canvas Sync Status
```dataview
TABLE sync_status, last_sync
FROM "Languages/English/Tutoring/TTL Class/Students/minitung/Canvas-Sync"
WHERE canvas_sync = true
SORT date DESC
LIMIT 5
```