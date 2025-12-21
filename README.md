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
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=12428072353
```

3. Set up the database:
```bash
npx prisma migrate dev
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
├── ServiceCard.tsx         # Service card component
└── WhatsAppButton.tsx      # WhatsApp integration

lib/
├── prisma.ts               # Prisma client
├── auth.ts                 # NextAuth configuration
└── fareCalculation.ts      # Fare calculation logic
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
- **Database**: SQLite (via Prisma)
- **Auth**: NextAuth.js
- **Maps**: Google Maps JavaScript API

## Deployment

Ready for deployment on Vercel or any Node.js platform. For production:

1. Update `DATABASE_URL` to a production database (PostgreSQL recommended)
2. Set proper `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
3. Add your Google Maps API key with proper restrictions

## Contact

Urban Nassau Rides
- Phone: (242) 807-2353
- Location: New Providence, Nassau, The Bahamas
- Hours: 6AM - 11:45PM Daily
