# Railway Deployment

This project deploys to Railway with managed PostgreSQL.

## Architecture

- **Web Service**: Next.js app (build + start)
- **PostgreSQL**: Railway-managed database
- `DATABASE_URL` is auto-injected when both services are in the same project

## Setup Steps

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. New Project → Deploy PostgreSQL (adds a Postgres service)
3. Add service → GitHub Repo → select `salutethegenius/urbannassau2.0`

### 2. Link Database to Web Service

- Open the web service → Variables
- `DATABASE_URL` is typically auto-injected when both services are in the same project
- If not, add a variable reference: `${{Postgres.DATABASE_URL}}` (adjust service name if different)

### 3. Environment Variables

Set in the web service Variables tab:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Auto from Postgres (or `${{Postgres.DATABASE_URL}}`) |
| `NEXTAUTH_URL` | `https://your-app.railway.app` (set after first deploy—use Railway's generated domain) |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `12428072353` (or your number) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API key |

**Important:** `NEXTAUTH_URL` must match the live app URL. Set it after the first deploy, then redeploy if needed.

### 4. Build and Deploy

Railway uses:
- **Build:** `npm run build` (includes `prisma generate`, `prisma migrate deploy`, `next build`)
- **Start:** `npm start` (runs `next start`)

Migrations run automatically during build.

### 5. Seed the Database

After the first successful deploy, run the seed once to create the default admin user and fare settings:

**Option A – Railway CLI:**
```bash
railway run npx prisma db seed
```

**Option B – Railway Dashboard:**
- Web service → Settings → one-off command / run command

### 6. Admin Login

Default credentials (change after first login):
- Email: `admin@urbannassau.com`
- Password: `admin123`

## Configuration Files

- `railway.json` – Explicit build/start config (optional; Railway auto-detects Next.js)
- `package.json` – Build script already includes Prisma migrate deploy
