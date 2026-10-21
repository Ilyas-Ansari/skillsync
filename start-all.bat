@echo off
echo ========================================================
echo  SkillSync - Full Stack Java Micro Project
echo  Team & Mentorship Matching System
echo ========================================================
echo.
echo Starting Spring Boot Backend on http://localhost:8080...
start cmd /k "cd backend && mvnw.cmd spring-boot:run"

echo Starting React Frontend on http://localhost:5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching!
echo Backend:  http://localhost:8080 (H2 Console: http://localhost:8080/h2-console)
echo Frontend: http://localhost:5173
echo.
pause
