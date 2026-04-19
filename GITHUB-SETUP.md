# GitHub Setup Guide

## ✅ Completed Steps

1. **Git Repository Initialized**
   - Repository created in `/Users/vasumakkar/Desktop/nammagear`
   - Default branch: `main`

2. **Initial Commit Created**
   - Commit hash: `f6cdc9e`
   - All project files committed (63 files, 6157 lines)
   - Includes backend, frontend, documentation, and CI/CD

3. **GitHub Files Added**
   - `.github/workflows/ci.yml` - GitHub Actions CI pipeline
   - `.github/PULL_REQUEST_TEMPLATE.md` - PR template
   - `LICENSE` - MIT License
   - `CONTRIBUTING.md` - Contribution guidelines
   - `.gitignore` - Already existed

## 📋 Next Steps: Connect to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name:** `nammagear`
   - **Description:** "Peer-to-peer marketplace for Bangalore students to buy and sell used electronics"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands:

```bash
cd ~/Desktop/nammagear

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nammagear.git

# Verify the remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

### Step 3: Configure Git User (Optional but Recommended)

Set your name and email for better commit attribution:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Fix the author of the initial commit
git commit --amend --reset-author --no-edit
git push -f origin main
```

## 🔐 Authentication Options

### Option 1: HTTPS with Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "NammaGear Development"
4. Select scopes: `repo` (full control)
5. Generate token and save it securely
6. Use the token as your password when pushing

### Option 2: SSH Keys

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. Add to SSH agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. Copy public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. Add to GitHub: Settings → SSH and GPG keys → New SSH key

5. Change remote to SSH:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/nammagear.git
   ```

## 🚀 GitHub Actions CI/CD

The project includes a GitHub Actions workflow that will:

- Run on every push to `main` and on pull requests
- Set up Node.js 20 and pnpm
- Install dependencies
- Build backend and frontend
- Run database migrations in test environment

**To enable GitHub Actions:**

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Enable workflows if prompted
4. The CI will run automatically on your next push

## 📊 Recommended Repository Settings

### Branch Protection (Optional)

Protect the `main` branch:

1. Go to Settings → Branches
2. Add rule for `main`
3. Enable:
   - Require pull request reviews before merging
   - Require status checks to pass (after first CI run)
   - Require branches to be up to date

### Secrets for Production

You'll need to add these secrets for production deployment:

1. Go to Settings → Secrets and variables → Actions
2. Add secrets:
   - `DATABASE_URL` - Production database URL
   - `JWT_SECRET` - Production JWT secret (generate new one)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## 📝 Daily Workflow

### Making Changes

```bash
# Create a feature branch
git checkout -b feature/auth-pages

# Make your changes, then:
git add .
git commit -m "Add login and signup pages"
git push origin feature/auth-pages

# Create a pull request on GitHub
```

### Updating from Main

```bash
git checkout main
git pull origin main
git checkout feature/your-feature
git merge main
```

## 🎯 Quick Commands Reference

```bash
# Check status
git status

# View history
git log --oneline --graph

# View remote
git remote -v

# Create branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull

# Push changes
git push

# View differences
git diff
```

## 🔧 Troubleshooting

### "Support for password authentication was removed"

Use a Personal Access Token or SSH key instead of your GitHub password.

### "Permission denied (publickey)"

Your SSH key isn't set up correctly. Follow the SSH setup steps above.

### "fatal: remote origin already exists"

Remove and re-add:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/nammagear.git
```

## ✅ Verification Checklist

After completing setup, verify:

- [ ] Repository created on GitHub
- [ ] Local repository connected to GitHub
- [ ] Initial commit pushed successfully
- [ ] Can see all files on GitHub
- [ ] GitHub Actions workflow runs successfully
- [ ] README displays correctly on repository page

## 🎉 You're All Set!

Your GitHub setup is complete. You can now:

1. **Share your repository** with collaborators
2. **Enable GitHub Actions** for automated testing
3. **Create pull requests** for code review
4. **Track issues** and project progress
5. **Deploy** to production (Prompt 10)

---

**Next step:** Continue with Prompt 7 (Auth Pages) or set up PostgreSQL to test the backend!
