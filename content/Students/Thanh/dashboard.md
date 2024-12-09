---
student: Thanh
start_date: 2024-12-04
level:
  "{ level }": 
goals:
  "{ goals }":
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
FROM "English/Tutoring/TTL Class/Students/minitung/Sessions"
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

## Active Goals
- > ([[Languages/English/Tutoring/TTL Class/Materials/PDF/Week 1 - TLinh - Assignment 1.pdf#page=1&selection=36,0,37,48&color=yellow|p.1]])
>  Sophia and Jenny are talking about solar energy.


## Notes & Reminders
<iframe
src="https://docs.google.com/viewer?url=https://pub-a6617bda9fbb496c9e31b3f3af0cb28d.r2.dev/Week%201%20-%20TLinh%20-%20Assignment%201.pdf&embedded=true"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
></iframe>
## PDF Materials & Resources

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