# Quick Setup Guide for Student Gear Shop

Follow these steps to get Student Gear Shop running on your local machine:

## 1. Prerequisites

Install these before starting:
- Node.js 20+ ([Download](https://nodejs.org/))
- PostgreSQL ([Download](https://www.postgresql.org/download/))
- pnpm: `npm install -g pnpm`
- A Cloudinary account ([Sign up free](https://cloudinary.com/))

## 2. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb student-gear-shop

# Or using PostgreSQL GUI tools like pgAdmin
```

## 3. Environment Configuration

### Backend Configuration

1. Copy the example file:
```bash
cp apps/api/.env.example apps/api/.env
```

2. Edit `apps/api/.env` with your values:
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/student-gear-shop"
JWT_SECRET="generate-a-random-secret-key-here"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
COOKIE_DOMAIN="localhost"
```

**Getting Cloudinary credentials:**
1. Sign up at https://cloudinary.com/
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

### Frontend Configuration

1. Copy the example file:
```bash
cp apps/web/.env.example apps/web/.env.local
```

2. Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## 4. Install Dependencies

From the project root:

```bash
pnpm install
```

## 5. Database Migration & Seeding

Run database migrations and seed initial data:

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed categories
cd apps/api
npx prisma db seed
cd ../..
```

## 6. Start Development Servers

Start both frontend and backend:

```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 7. Verify Everything Works

1. Open http://localhost:3000 in your browser
2. You should see the Student Gear Shop homepage
3. Try signing up with a test account
4. Create a test listing

## Common Issues & Solutions

### Issue: "Cannot connect to database"
- **Solution**: Make sure PostgreSQL is running and DATABASE_URL is correct
- Check: `psql -U your_username -d student-gear-shop` to test connection

### Issue: "Cloudinary upload failed"
- **Solution**: Verify your Cloudinary credentials in `.env`
- Check: All three values (CLOUD_NAME, API_KEY, API_SECRET) are correct

### Issue: "Port already in use"
- **Solution**: Change the PORT in `apps/api/.env` to something else (e.g., 3002)
- Update `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` accordingly

### Issue: "Prisma Client not generated"
- **Solution**: Run `pnpm db:generate` from the project root

### Issue: CORS errors
- **Solution**: Make sure CORS_ORIGIN in backend .env matches your frontend URL

## Next Steps

1. **Create test data**: Sign up and create a few listings to populate the marketplace
2. **Test features**: Try browsing, filtering, creating listings, and WhatsApp contact
3. **Customize**: Update branding, colors, or add new categories in the seed file
4. **Deploy**: Check the main README for deployment instructions

## Development Workflow

```bash
# Start development
pnpm dev

# Run specific app
pnpm --filter web dev    # Frontend only
pnpm --filter api dev    # Backend only

# Database commands
pnpm db:studio          # Open Prisma Studio (database GUI)
pnpm db:migrate         # Run migrations
pnpm db:generate        # Regenerate Prisma client

# Build for production
pnpm build

# Start production
pnpm start
```

## Need Help?

Check the main README.md for:
- Full API documentation
- Database schema details
- Project structure
- Contributing guidelines

Happy coding! 🚀
