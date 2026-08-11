# Start both the AceQuest backend and frontend for local development.
# Run this from the acequest folder using PowerShell.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

# Look for common virtualenv locations
$possiblePython = @(
    Join-Path $backend '.venv\Scripts\python.exe'
    Join-Path $backend 'venv\Scripts\python.exe'
)
$python = $possiblePython | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $python) {
    Write-Host 'Error: Could not find Python virtual environment in backend/venv or backend/.venv.' -ForegroundColor Red
    Write-Host 'Please create or activate the backend virtual environment first.' -ForegroundColor Yellow
    exit 1
}


$portBackend = 8000
$portFrontend = 5173
$hostAddress = '127.0.0.1'

$backendCommand = "& '$python' -m uvicorn app.main:app --reload --host $hostAddress --port $portBackend"
$frontendCommand = "cd '$frontend'; npm run dev -- --host $hostAddress --port $portFrontend"

Start-Process powershell -ArgumentList '-NoExit','-Command', "cd '$backend'; $backendCommand"
Start-Process powershell -ArgumentList '-NoExit','-Command', "cd '$frontend'; $frontendCommand"

Write-Host "Started backend on http://${hostAddress}:${portBackend}" -ForegroundColor Green
Write-Host "Started frontend on http://${hostAddress}:${portFrontend}" -ForegroundColor Green
Write-Host "Open the app in the browser at http://${hostAddress}:${portFrontend}"
