Startup and persistent run instructions
-------------------------------------

What this does
- Fixes the `start-acequest.ps1` launcher so it correctly finds the Python virtualenv.
- Adds `register-startup.ps1` to register a scheduled task that will run the launcher at user logon.

Important notes
- A laptop that is shut down cannot run services. "Permanent" hosting requires the machine to be powered on or using a remote host.
- The scheduled task will start the backend and frontend automatically when you log into Windows.

How to use
1. From PowerShell (optionally elevated), run the launcher once to verify everything starts:

```powershell
cd "acequest"
.\start-acequest.ps1
```

2. To register the launcher to run at each logon (automatic):

```powershell
cd "acequest"
.\register-startup.ps1
```

3. To remove the scheduled task later:

```powershell
schtasks /Delete /TN "AceQuestStartup" /F
```

Backend database
- The backend uses `DATABASE_URL` in `.env` (defaults to `sqlite:///./acequest.db`).
- The DB file `acequest.db` persists to disk inside the `backend` folder, so user accounts and progress survive restarts.

If you want real remote availability
- Deploy the backend to a cloud VM or container and serve the frontend from a static host or the same VM.
- Alternatively, use a tunneling service like `ngrok` while your laptop is on.
