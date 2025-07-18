# Competitor Ad Intelligence Tool

Internal dashboard for monitoring competitor advertising across Meta, Snapchat, Twitter, Google Search, and display networks.

## Features

- **Dashboard**: Overview of competitor activity and performance metrics
- **Company Lookup**: Search and view any company's advertising activity across all platforms
- **Ad Explorer**: Browse and filter competitor ads with bookmarking functionality
- **Search Intelligence**: Monitor competitor search rankings across key US states
- **Multi-Platform Support**: Meta, Twitter, Snapchat, Google Search tracking

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript
- **UI**: shadcn/ui components + Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **APIs**: Meta Ad Library, Google Search, custom scrapers

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run database setup: `npx prisma generate`
5. Start development server: `npm run dev`

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="your-postgresql-url"

# Meta Ad Library API
META_ACCESS_TOKEN="your-meta-access-token"

# Google Search API (optional)
GOOGLE_API_KEY="your-google-api-key"
GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"
```

## Database Setup

The app uses PostgreSQL with Prisma. For local development:

1. Set up a PostgreSQL database
2. Update `DATABASE_URL` in `.env`
3. Run `npx prisma generate`
4. Run `npx prisma db push` to create tables

For production, the app works with any PostgreSQL provider (Vercel Postgres, Supabase, etc.).

## API Integrations

### Meta Ad Library
- Requires a Meta developer account and access token
- Used for fetching Facebook/Instagram ads

### Google Search (Optional)
- Requires Google Custom Search API
- Used for SERP monitoring

### Web Scrapers
- Built-in scrapers for Twitter, Snapchat ad transparency
- Includes mock data for development

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

This app is ready for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

For other platforms, ensure you have:
- Node.js 18+
- PostgreSQL database
- Environment variables configured

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── competitors/       # Company lookup and profiles
│   ├── ads/              # Ad explorer
│   ├── search/           # Search intelligence
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific
│   ├── ads/              # Ad explorer components
│   ├── search/           # Search components
│   └── competitor/       # Company profile components
├── lib/                  # Utility functions
│   ├── database/         # Prisma client
│   └── scrapers/         # API integrations
└── types/                # TypeScript types
```

## Usage

### Company Lookup
Search for any company (e.g., "Caesars Palace Online Casino") to see their advertising activity across all platforms in one unified view.

### Ad Monitoring
Browse competitor ads with filters for platform, format, date range, and competitor. Bookmark interesting ads for later reference.

### Search Tracking
Monitor how competitors appear in search results across different US states for key industry terms.

## License

Internal use only.
