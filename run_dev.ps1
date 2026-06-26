# Runs backend (uvicorn) and frontend (npm dev) concurrently in separate terminals
$backendCmd = ".\backend\venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"
$frontendCmd = "cd frontend; npm run dev"

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit","-Command","$backendCmd"
# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit","-Command","$frontendCmd"

Write-Host "Started backend and frontend in new PowerShell windows. Backend: http://localhost:8000 Frontend: http://localhost:3000"