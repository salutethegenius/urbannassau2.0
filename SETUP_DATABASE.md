# Database Setup Guide

This project uses **Supabase (PostgreSQL)** for production. Follow these steps to set up your database.

## Option 1: Supabase (Recommended)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose an organization and give your project a name
4. Set a database password (save this securely!)
5. Choose a region closest to your users (e.g., US East)
6. Click "Create new project"

### Step 2: Get Your Database URL

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll down to "Connection string" section
3. Copy the **Connection string** under "URI"
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
4. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Set Up Local Environment

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add your database URL:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
   ```

### Step 4: Set Up Production Environment (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (same as above)
   - **Environment**: Production, Preview, Development (check all)
4. Click **Save**

### Step 5: Run Migrations

After setting up your database URL:

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Run migrations to create tables:**
   ```bash
   npx prisma migrate dev --name init
   ```

   Or if you want to push the schema directly:
   ```bash
   npx prisma db push
   ```

3. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

### Step 6: Verify Connection

Test that everything works:
```bash
npm run dev
```

Visit your app and try using the calculator - it should work now!

---

## Option 2: Alternative Databases

### Neon (PostgreSQL - Serverless)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a project
3. Copy the connection string
4. Use the same setup steps as Supabase above

### PlanetScale (MySQL)

1. Go to [planetscale.com](https://planetscale.com)
2. Note: You'll need to change the Prisma schema to use `mysql` instead of `postgresql`
3. Follow their setup guide

---

## Troubleshooting

### "Relation does not exist" error
- Run migrations: `npx prisma migrate dev`
- Or push schema: `npx prisma db push`

### Connection timeout
- Check your database URL is correct
- Verify your IP is allowed (Supabase allows all IPs by default)
- Check if your database is paused (free tier databases pause after inactivity)

### Environment variables not working
- Make sure `.env.local` exists (not `.env`)
- Restart your dev server after changing `.env.local`
- In Vercel, make sure environment variables are set for all environments

---

## Local Development (SQLite - Optional)

For local development, you can still use SQLite if preferred:

1. Change `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL="file:./prisma/dev.db"` in `.env.local`
3. Note: This won't work on Vercel, only locally

