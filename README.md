# NammaGear

> Bangalore's student tech marketplace - Pre-loved tech, campus to campus.

A peer-to-peer marketplace for Bangalore students to buy and sell used electronics. Built with Next.js, Express, PostgreSQL, and Prisma.

## Features

- 🔐 JWT authentication with httpOnly cookies
- 📍 Bangalore pincode validation (560001-560103)
- 🎨 Beautiful UI with light/dark theme support
- 📱 WhatsApp integration for direct buyer-seller contact
- 🖼️ Cloudinary image uploads (up to 5 images per listing)
- ⚡ Real-time listing updates
- 🔍 Advanced filtering (category, price, condition, area)
- ✅ Condition grading system (A/B/C)
- 🎓 Student verification via college email

## Tech Stack

### Frontend (`apps/web`)
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- TanStack Query (React Query)
- Zustand (state management)

### Backend (`apps/api`)
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Cloudinary (image storage)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm (recommended) or npm
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nammagear
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

**Backend (`apps/api/.env`):**
```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values
```

**Frontend (`apps/web/.env.local`):**
```bash
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local with your values
```

4. Set up the database:
```bash
# Run migrations
pnpm db:migrate

# Seed initial data (categories)
cd apps/api
pnpm prisma db seed
cd ../..
```

5. Start development servers:
```bash
# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm --filter web dev    # Frontend on http://localhost:3000
pnpm --filter api dev    # Backend on http://localhost:3001
```

## Project Structure

```
nammagear/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities and API hooks
│   └── api/                # Express backend
│       ├── src/
│       │   ├── routes/    # API routes
│       │   ├── services/  # Business logic
│       │   ├── middleware/ # Auth, validation
│       │   └── lib/       # Utilities
│       └── prisma/        # Database schema and migrations
├── package.json
└── pnpm-workspace.yaml
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (auth required)
- `PATCH /api/listings/:id` - Update listing (auth required, owner only)
- `DELETE /api/listings/:id` - Delete listing (auth required, owner only)
- `GET /api/listings/:id/contact` - Get seller contact info (auth required)

### Upload
- `POST /api/upload` - Upload images to Cloudinary (auth required)

### Categories
- `GET /api/categories` - Get all product categories

## Database Schema

Key models:
- **User**: Student accounts with college verification
- **Listing**: Product listings with images and metadata
- **Category**: Product categories (Laptops, Monitors, etc.)
- **ListingImage**: Associated images for each listing
- **Save**: Saved/bookmarked listings by users
- **Report**: User reports for inappropriate listings

## Conventions

- All API routes use `/api` prefix
- JWT tokens stored in httpOnly cookies (`ng_token`)
- Images hosted on Cloudinary (never local disk)
- Zod validation on all API endpoints
- Prisma for all database queries
- TanStack Query for frontend data fetching

## Product Rules

- Only Bangalore pincodes (560001-560103) allowed
- Authenticated users can create listings
- Users can only edit/delete their own listings
- Listing conditions: A (like new), B (good), C (fair)
- Listing status: ACTIVE, SOLD, REMOVED
- Maximum 5 images per listing
- Contact via WhatsApp deep link

## Development Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm --filter web dev      # Start frontend only
pnpm --filter api dev      # Start backend only

# Database
pnpm db:migrate            # Run migrations
pnpm db:generate           # Generate Prisma client
pnpm db:studio             # Open Prisma Studio

# Build
pnpm build                 # Build all apps
pnpm --filter web build    # Build frontend
pnpm --filter api build    # Build backend

# Production
pnpm start                 # Start production servers
```

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
