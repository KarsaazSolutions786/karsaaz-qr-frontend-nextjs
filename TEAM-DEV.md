# Team dev — frontend on your laptop, backend on host machine

API runs on the **host PC** (team lead). You run the **frontend** on your laptop.

## Option A — Docker (recommended, no Node install issues)

1. `git pull` latest `production_v2`
2. ```powershell
   cd "karsaaz Qr React js"
   copy .env.team.example .env
   ```
3. Edit `.env` — **only change this line** (host gives you the IP):

   ```env
   NEXT_PUBLIC_API_URL=http://192.168.80.1:8000
   ```

   **No `/api` at the end.**

4. Start:

   ```powershell
   .\scripts\docker-dev.ps1
   ```

   Or: `docker compose -f docker-compose.dev.yml up`

5. Open: **http://localhost:3005**

First start takes a few minutes (`npm install` inside container). Later starts are faster.

## Option B — npm on your laptop (no Docker)

```powershell
npm install
npm run dev
```

Same `.env` as above. Open http://localhost:3005

---

## What was wrong with old Docker setup

- `docker-compose.yml` used `http://localhost:8000/api` (wrong — extra `/api`, and localhost = your laptop not the host)
- `NEXT_PUBLIC_*` in production Docker is **baked at build** — changing env after build did nothing
- Port was 3000 but dev uses **3005**

Fixed: `docker-compose.dev.yml` for juniors, fixed `docker-compose.yml` for host production build, runtime `BACKEND_URL` injection.

---

## Host (person running the API)

```powershell
.\scripts\start-backend.ps1          # from monorepo root
.\scripts\show-team-dev-urls.ps1       # prints IPs to share
```

Share: `NEXT_PUBLIC_API_URL=http://<LAN_IP>:8000`

Firewall: allow TCP **8000**. Same Wi‑Fi as juniors.

Optional — host runs frontend Docker for everyone:

```powershell
cd "karsaaz Qr React js"
$env:BACKEND_URL="http://192.168.80.1:8000"
docker compose up --build
```

Juniors open `http://<HOST_IP>:3005` in browser (no Docker on their side).

---

## Troubleshooting

| Problem                | Fix                                                   |
| ---------------------- | ----------------------------------------------------- |
| `blocked:csp`          | `git pull`, correct `.env`, restart docker/npm        |
| `curl` to API fails    | Firewall / wrong IP / backend not running on host     |
| Docker slow on Windows | Normal first `npm install`; use Option B if preferred |
