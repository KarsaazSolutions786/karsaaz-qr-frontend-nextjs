# Team dev — frontend on your laptop, backend on host machine

Use this when **you clone the frontend** and the **API runs on someone else's PC** on the LAN.

## Your setup (junior dev laptop)

1. **Pull latest code** (needs CSP fix in `next.config.js` from 2026-07-02+)
2. Copy env file:
   ```powershell
   cd "karsaaz Qr React js"
   copy .env.team.example .env
   ```
3. Edit `.env` — set `NEXT_PUBLIC_API_URL` to the host's LAN IP:

   ```env
   NEXT_PUBLIC_API_URL=http://192.168.80.1:8000
   ```

   Ask the host for their IP (`ipconfig` on their Windows PC).

4. Install and run:
   ```powershell
   npm install
   npm run dev
   ```
5. Open **on your laptop**: `http://localhost:3005`  
   Do **not** open the host's IP in the browser for the UI — only the API uses that IP.

## Why CSP errors happen

The browser blocks API calls based on **your local Next.js app's** Content-Security-Policy, not the remote backend.

If you see `blocked:csp` when calling `http://192.168.x.x:8000`:

| Cause                               | Fix                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| Old code without CSP LAN fix        | `git pull` latest `next.config.js`                        |
| Wrong `.env`                        | `NEXT_PUBLIC_API_URL=http://HOST_IP:8000` (not localhost) |
| Did not restart after `.env` change | Stop `npm run dev` and start again                        |
| Backend unreachable                 | See host checklist below                                  |

## Host machine checklist (person running the API)

1. Backend running: `.\scripts\start-backend.ps1` from repo root
2. Test locally: `curl http://127.0.0.1:8000/api/health`
3. Test from LAN IP: `curl http://192.168.80.1:8000/api/health` (use real IP)
4. **Windows Firewall** — allow inbound TCP port **8000**
5. Same Wi‑Fi / LAN as junior devs (no guest network isolation)

Host does **not** need to share frontend — only API URL `http://<LAN_IP>:8000`.

## Verify from junior laptop

```powershell
curl http://192.168.80.1:8000/api/health
```

Should return JSON with `"status":"healthy"`. If this fails, it is network/firewall — not CSP.

If curl works but browser shows CSP error, restart `npm run dev` after updating `.env` and pulling latest code.
