@echo off
echo Starting NeverMore Caterpillar Services...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && python run.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Caterpillar FrontEnd && npm run dev"

echo.
echo Services are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
