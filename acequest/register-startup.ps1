<#
Register a scheduled task to run `start-acequest.ps1` at user logon.

Run this script from an elevated PowerShell prompt if you want the task
to run with highest privileges. It will create or replace a task named
"AceQuestStartup" that runs the project launcher at each user logon.

Note: This will not keep the server running while the laptop is shut down.
A scheduled task can only run when the machine is on and the user logs in.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$launcher = Join-Path $root 'start-acequest.ps1'

if (-not (Test-Path $launcher)) {
    Write-Error "Launcher not found at: $launcher"
    exit 1
}

$taskName = 'AceQuestStartup'
$action = "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$launcher`""

try {
    # Use schtasks for compatibility
    schtasks /Create /SC ONLOGON /TN $taskName /TR $action /F | Out-Null
    Write-Host "Scheduled task '$taskName' created (or updated) to run at user logon." -ForegroundColor Green
    Write-Host "You can remove it with: schtasks /Delete /TN $taskName /F" -ForegroundColor Yellow
} catch {
    Write-Error "Failed to create scheduled task: $_"
    exit 1
}
