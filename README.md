# NammaGear

Peer-to-peer marketplace for Bangalore students to buy and sell used electronics.

## Tech Stack

- **Backend:** Node.js 20, Express, TypeScript, Prisma, PostgreSQL 16
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, TanStack Query
- **Auth:** JWT in httpOnly cookies
- **Images:** Cloudinary
- **Deployment:** Hostinger VPS with Nginx, PM2, GitHub Actions

## Development Setup

### Prerequisites Installed ✅
- Node.js 20.12.0 (installed to `~/.node/`)
- pnpm 10.33.0

### Still Need
- PostgreSQL 16

### Quick Start

```bash
# 1. Install PostgreSQL
brew install postgresql@16
brew services start postgresql@16
createdb nammagear

# 2. Run database migrations
cd ~/Desktop/nammagear
export PATH="$HOME/.node/bin:$PATH"
pnpm --filter api prisma migrate dev --name init
pnpm --filter api prisma db seed

# 3. Configure Cloudinary (optional for MVP)
# Edit apps/api/.env with your Cloudinary credentials from cloudinary.com

# 4. Start development servers
pnpm dev
```

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:4000  
**Health:** http://localhost:4000/health

## Project Structure

```
nammagear/
├── apps/
│   ├── api/           # Express backend (COMPLETE)
│   └── web/           # Next.js frontend (scaffold done, pages pending)
├── .cursorrules       # Master context for Cursor AI
└── package.json       # Workspace root
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Listings
- `POST /api/listings` - Create listing
- `GET /api/listings` - Browse with filters
- `GET /api/listings/:id` - Get details
- `PATCH /api/listings/:id` - Update (owner only)
- `DELETE /api/listings/:id` - Delete (owner only)
- `GET /api/listings/:id/contact` - Get WhatsApp link

### Upload
- `POST /api/upload/image` - Upload to Cloudinary
- `DELETE /api/upload/image/:publicId` - Delete image

## Development Commands

```bash
# Install dependencies (already done)
pnpm install

# Start both dev servers
pnpm dev

# Start backend only
pnpm --filter api dev

# Start frontend only
pnpm --filter web dev

# Build for production
pnpm build

# Database commands
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed
pnpm --filter api prisma studio
```

## Features Implemented

### Backend (100% Complete)
- ✅ JWT authentication with httpOnly cookies
- ✅ Bangalore pincode validation (560001-560103)
- ✅ Cloudinary image hosting
- ✅ WhatsApp deep link generation
- ✅ Rate limiting and security middleware
- ✅ Full CRUD for listings
- ✅ Ownership verification
- ✅ Database seeding

### Frontend (Scaffold Complete)
- ✅ Landing page
- ✅ Navigation with auth state
- ✅ API client with auth
- ✅ TanStack Query setup
- ⏳ Auth pages (next)
- ⏳ Browse & listing detail (next)
- ⏳ Sell & my-listings (next)

## Next Steps

See [SETUP-COMPLETE.md](./SETUP-COMPLETE.md) for detailed status and remaining work (Prompts 7-10).

## GitHub Setup

See [GITHUB-SETUP.md](./GITHUB-SETUP.md) for complete instructions on:
- Connecting to GitHub
- Setting up CI/CD
- Branch protection
- Daily workflow

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - See [LICENSE](./LICENSE) for details
