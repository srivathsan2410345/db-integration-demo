# Seminar Demo: Phone → React → Express → Prisma → PostgreSQL

Tiny shared message board for a live seminar. Demonstrates a full stack, a global
Persistence toggle (Postgres vs in-memory), and a GOOD/BAD UI toggle (frontend-only).

**Stack:** React + Vite (Vercel) · Express + Prisma (Render) · Neon PostgreSQL

## Local setup
```bash
# Backend
cd backend
cp .env.example .env        # then set DATABASE_URL
npm install                 # also runs prisma generate
npx prisma migrate dev --name init
npm run dev                 # http://localhost:3000

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```
Local Postgres: `DATABASE_URL="postgresql://postgres:password@localhost:5432/seminar"` (`createdb seminar` first), or use the Neon URL.

## Environment variables
| File | Variable | Example |
|---|---|---|
| backend/.env | DATABASE_URL | Neon string |
| backend/.env | PORT | 3000 (Render sets it) |
| backend/.env | FRONTEND_URL | http://localhost:5173 (prod: Vercel URL, comma-separate several) |
| frontend/.env | VITE_API_URL | http://localhost:3000 (prod: Render URL) |

## API
- `GET /api/messages`, `POST /api/messages` `{ "text": "..." }` (1–200 chars, trimmed, 20 posts/min/IP)
- `GET /api/settings`, `POST /api/settings` `{ "persistence": true|false }` (global)

## Neon
1. Create project at neon.tech, click **Connect**.
2. Turn **off** connection pooling (use the direct host, no `-pooler`).
3. Copy the string (ends in `?sslmode=require`) into `backend/.env`, run `npx prisma migrate dev --name init` once.

## Render (backend)
New → Web Service, Root Directory `backend`, Build `npm install && npx prisma migrate deploy`, Start `npm start`.
Env: `DATABASE_URL`, `FRONTEND_URL` (Vercel URL, no trailing slash). Test `/api/messages` returns `[]`.
Free tier sleeps: open the app ~5 min before the seminar.

## Vercel (frontend)
Import repo, Root Directory `frontend`, env `VITE_API_URL=https://<name>.onrender.com`. Deploy, then set Render's `FRONTEND_URL`.
Changing `VITE_API_URL` requires a redeploy (baked in at build).

## CORS
Backend only allows browser Origins listed in `FRONTEND_URL` (exact match, https, no trailing slash).

## Behaviour
- **Persistence ON:** Prisma → Postgres. **OFF:** in-memory array; survives refresh, cleared on backend restart (mode resets to ON). The two lists are separate.
- **UI mode:** per-browser, CSS only. API/backend/DB unchanged.
- **Multi-user:** everyone shares the same messages; frontend polls every 2.5s.

## Testing
- Multi-phone: open on 2–3 phones + laptop, send from each; all appear within ~3s.
- Persistence: ON send "A", refresh → stays. OFF send "B" → stays on refresh. Restart backend → "B" gone, "A" remains.
- UI: toggle GOOD/BAD, messages unchanged.

## QR code
Generate for the Vercel URL (any QR site, or `npx qrcode-terminal <url>`). Test on mobile data.

## Message path
MessageBox.jsx → App.jsx `handleSend` → services/api.js (fetch) → server.js (CORS/JSON) → routes/messageRoutes.js → controllers/messageController.js (validation via schemas/messageSchema.js) → services/messageService.js → db/prisma.js → PostgreSQL; errors via middleware/errorHandler.js.
