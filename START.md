# 🚀 Quick Start Guide - Student Gear Shop

## Project Location
Your project is now at: `~/Desktop/student-gear-shop`

## Current Status
- ✅ Node.js, pnpm installed
- ✅ Backend API complete (12 endpoints)
- ✅ Frontend scaffolded
- ⚠️ Need PostgreSQL to run

## Start Development (3 commands)

```bash
# 1. Open Terminal and navigate to project
cd ~/Desktop/student-gear-shop

# 2. Add Node to PATH (for this session)
export PATH="$HOME/.node/bin:$PATH"

# 3. Install PostgreSQL (if not already installed)
brew install postgresql@16
brew services start postgresql@16
createdb student-gear-shop

# 4. Run database setup (first time only)
pnpm --filter api prisma migrate dev --name init
pnpm --filter api prisma db seed

# 5. Start everything
pnpm dev
```

Then open:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000
- **Health Check:** http://localhost:4000/health

## Troubleshooting

### "command not found: node" or "command not found: pnpm"
```bash
export PATH="$HOME/.node/bin:$PATH"
```

### Want to make Node permanent?
It's already in your `~/.zshrc`, but if you need to reload:
```bash
source ~/.zshrc
```

### Database connection errors
Make sure PostgreSQL is running:
```bash
brew services start postgresql@16
```

## Next Steps

See `SETUP-COMPLETE.md` for:
- Full API documentation
- Testing commands
- Remaining work (auth pages, browse, sell pages)
- Deployment instructions

## Need Help?

Check these files in order:
1. `START.md` (this file) - Quick start
2. `README.md` - Overview and commands
3. `SETUP-COMPLETE.md` - Detailed status and next steps
