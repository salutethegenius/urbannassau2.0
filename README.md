# Urban Nassau Rides

A modern ride and delivery service platform for Nassau, Bahamas. Built with Next.js 14, featuring a fare calculator with Google Maps integration and WhatsApp quote delivery.

## Features

- **Ride Calculator**: Calculate fares with Google Maps integration for accurate distance
- **Multiple Services**: Rides, Courier, Errands, Personal Shopping, Transport of Goods
- **WhatsApp Integration**: Send quotes directly via WhatsApp with one tap
- **Admin Dashboard**: Manage all pricing from an admin panel
- **Mobile-Friendly**: Big buttons, simple copy, designed for all users

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Maps API Key (with Places and Directions APIs enabled)

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your values:

**For Production (Supabase/PostgreSQL)** - See [SETUP_DATABASE.md](./SETUP_DATABASE.md):
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=12428072353
```

**For Local Development (SQLite)** - Note: Won't work on Vercel:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=12428072353
```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev

# Or push schema directly
npx prisma db push

# Seed initial data (optional)
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Default Admin Credentials

After running the seed script:
- **Email**: admin@urbannassau.com
- **Password**: admin123

**Important**: Change the password after first login!

## Project Structure

```
app/
├── page.tsx                 # Home page
├── calculator/page.tsx      # Ride fare calculator
├── services/page.tsx        # Services & pricing
├── careers/page.tsx        # Driver apply / careers
├── admin/
│   ├── page.tsx            # Admin dashboard
│   ├── login/page.tsx      # Admin login
│   └── settings/page.tsx   # Fare settings editor
└── api/
    ├── auth/               # NextAuth endpoints
    ├── fares/              # Fare history API
    └── settings/           # Settings API

components/
├── Header.tsx              # Site header
├── Footer.tsx              # Site footer
├── MapPicker.tsx           # Google Maps picker
├── FareCalculator.tsx      # Fare calculator UI
└── WhatsAppButton.tsx      # WhatsApp integration

lib/
├── prisma.ts               # Prisma client
├── auth.ts                 # NextAuth configuration
└── fareCalculation.ts      # Fare calculation logic

types/
├── map.ts                  # Shared Location type
└── next-auth.d.ts          # NextAuth session types
```

## Fare Calculation

The fare formula:
```
Total = BaseFare + DistanceCharge + PassengerCharge

Where:
- DistanceCharge = max(0, (distance - freeDistance)) × perMileRate
- PassengerCharge = max(0, (passengers - 1)) × passengerFee
```

All values are configurable from the admin panel.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase) - See [SETUP_DATABASE.md](./SETUP_DATABASE.md)
- **Auth**: NextAuth.js
- **Maps**: Google Maps JavaScript API

## Database Setup

**Important**: This project uses PostgreSQL for production (required for Vercel deployment).

See [SETUP_DATABASE.md](./SETUP_DATABASE.md) for detailed instructions on:
- Setting up Supabase (recommended)
- Running migrations
- Configuring environment variables
- Troubleshooting

## Deployment

Ready for deployment on Vercel or any Node.js platform. For production:

1. **Set up database**: Follow [SETUP_DATABASE.md](./SETUP_DATABASE.md) to set up Supabase
2. Set proper `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in Vercel environment variables
3. Add your Google Maps API key with proper restrictions in Vercel environment variables
4. Ensure `DATABASE_URL` is set in Vercel (from Supabase connection string)

## Contact

Urban Nassau Rides
- Phone: (242) 807-2353
- Location: New Providence, Nassau, The Bahamas
- Hours: 6AM - 11:45PM Daily
