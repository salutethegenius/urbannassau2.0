# Supabase Connection Setup

> **Note:** Production deployments use Railway's managed PostgreSQL. See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md). This document is kept for local development with Supabase or as a reference.

## Current Connection Info
- Project URL: https://dqdecyjspbkpbzrtchzy.supabase.co
- Project Reference: dqdecyjspbkpbzrtchzy

## Connection String Format

Your connection string should be in one of these formats:

### Option 1: Direct Connection (for migrations, local dev)
```
postgresql://postgres:YOUR_PASSWORD@db.dqdecyjspbkpbzrtchzy.supabase.co:5432/postgres
```

### Option 2: Connection Pooling (recommended for production)
```
postgresql://postgres:YOUR_PASSWORD@db.dqdecyjspbkpbzrtchzy.supabase.co:6543/postgres?pgbouncer=true
```

## Steps to Get Your Connection String

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/dqdecyjspbkpbzrtchzy

2. **Check if database is paused**:
   - If paused, click "Restore" to wake it up
   - Free tier databases pause after 1 week of inactivity

3. **Get Connection String**:
   - Go to **Settings** → **Database**
   - Scroll to **Connection string** section
   - Copy the **URI** connection string (under "Connection pooling" or "Direct connection")
   - Use "Connection pooling" for production/Vercel
   - Use "Direct connection" for local development/migrations

4. **Update your .env file**:
   ```env
   DATABASE_URL="paste_the_connection_string_here"
   ```

## Current .env Status

Your current connection string format looks correct:
```
postgresql://postgres:urbannassaurides@db.dqdecyjspbkpbzrtchzy.supabase.co:5432/postgres
```

If you're getting "Can't reach database server" error:
1. Make sure the database is not paused (check Supabase dashboard)
2. Verify the password is correct
3. Try using the connection pooling port (6543) instead:
   ```
   postgresql://postgres:urbannassaurides@db.dqdecyjspbkpbzrtchzy.supabase.co:6543/postgres?pgbouncer=true
   ```

