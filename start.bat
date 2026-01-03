@echo off
echo ========================================
echo Employee Management System
echo ========================================
echo.
echo Starting Backend Server...
echo.
start cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
echo.
start cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo ========================================
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
