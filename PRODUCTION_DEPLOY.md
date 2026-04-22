# 🚀 Production Deployment Guide for microlynk.shop

## Prerequisites

✅ Domain: `microlynk.shop` and `api.microlynk.shop` pointing to VPS  
✅ Hostinger VPS: `147.79.66.164`  
✅ SSH access configured  
✅ VPS has: Node.js, PostgreSQL, PM2, Nginx installed  

---

## 📋 Step-by-Step Deployment

### 1️⃣ **Initial VPS Setup** (One-time)

SSH into your VPS:
```bash
ssh root@147.79.66.164
```

Run the setup script:
```bash
cd /home/deploy/nammagear
./setup-production.sh
```

This creates:
- `apps/api/.env` - API environment variables
- `apps/web/.env.local` - Web environment variables

### 2️⃣ **Configure Environment Variables**

Edit the API environment:
```bash
nano apps/api/.env
```

Update these values:
```bash
DATABASE_URL="postgresql://sgshop:YOUR_DB_PASSWORD@localhost:5432/student_gear_shop"
JWT_SECRET="$(openssl rand -base64 64)"  # Generate this!
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CORS_ORIGIN="https://microlynk.shop"
COOKIE_DOMAIN="microlynk.shop"
```

Web environment is already set:
```bash
NEXT_PUBLIC_API_URL=https://api.microlynk.shop
```

### 3️⃣ **Setup PostgreSQL Database**

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database user
CREATE USER sgshop WITH PASSWORD 'your-secure-password';

# Create database
CREATE DATABASE student_gear_shop OWNER sgshop;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE student_gear_shop TO sgshop;

# Exit
\q
```

### 4️⃣ **Create Admin User in Database**

```bash
# Generate password hash
cd /home/deploy/nammagear/apps/api
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin@2026!Secure', 10, (err, hash) => { console.log(hash); });"

# Copy the hash output, then insert user
psql -U sgshop -d student_gear_shop
```

```sql
INSERT INTO "User" (id, email, "passwordHash", name, college, phone, role, "verifiedAt", pincode, area, "createdAt", "updatedAt")
VALUES (
  'admin001',
  'admin@microlynk.shop',
  '$2b$10$PASTE_YOUR_HASH_HERE',
  'Admin',
  'Microlynk Shop',
  '+919876543210',
  'ADMIN',
  NOW(),
  '560001',
  'Bangalore',
  NOW(),
  NOW()
);
```

### 5️⃣ **Deploy the Application**

From your laptop, run:
```bash
./deploy-remote.sh
```

Or on the VPS directly:
```bash
cd /home/deploy/nammagear
./deploy.sh
```

This will:
1. Pull latest code from GitHub
2. Install dependencies
3. Run database migrations
4. Build applications
5. Restart PM2 processes

### 6️⃣ **Configure Nginx** (One-time)

The VPS should already have Nginx configs at:
- `/etc/nginx/sites-available/microlynk.shop` → Web app
- `/etc/nginx/sites-available/api.microlynk.shop` → API

If not, copy from repo:
```bash
sudo cp nginx-web.conf /etc/nginx/sites-available/microlynk.shop
sudo cp nginx-api.conf /etc/nginx/sites-available/api.microlynk.shop
sudo ln -s /etc/nginx/sites-available/microlynk.shop /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.microlynk.shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7️⃣ **Setup SSL Certificates** (One-time)

```bash
sudo certbot --nginx -d microlynk.shop -d www.microlynk.shop -d api.microlynk.shop
```

---

## 🔄 Regular Deployments

Once setup is complete, deploy new code by simply:

```bash
./deploy-remote.sh
```

Or use **GitHub Actions** (auto-deploys on push to main):
1. Add these secrets in GitHub repo settings:
   - `VPS_HOST` = `147.79.66.164`
   - `VPS_USER` = `root` or `deploy`
   - `VPS_SSH_KEY` = Your SSH private key

---

## 🔍 Monitoring

Check status:
```bash
ssh root@147.79.66.164 "sudo -u deploy pm2 status"
```

View logs:
```bash
ssh root@147.79.66.164 "sudo -u deploy pm2 logs"
ssh root@147.79.66.164 "sudo -u deploy pm2 logs api"
ssh root@147.79.66.164 "sudo -u deploy pm2 logs web"
```

Monitor live:
```bash
ssh root@147.79.66.164 "sudo -u deploy pm2 monit"
```

---

## 🌐 Access Your Site

- **Website:** https://microlynk.shop
- **API:** https://api.microlynk.shop
- **Admin Login:** https://microlynk.shop/auth/signin
- **Admin Panel:** https://microlynk.shop/admin/listings

---

## 🔐 Admin Credentials

**Email:** admin@microlynk.shop  
**Password:** Admin@2026!Secure  

⚠️ Change password after first login!

---

## 🆘 Troubleshooting

**API not responding:**
```bash
ssh root@147.79.66.164
sudo -u deploy pm2 restart api
sudo -u deploy pm2 logs api
```

**Web app not loading:**
```bash
sudo -u deploy pm2 restart web
sudo -u deploy pm2 logs web
```

**Database issues:**
```bash
sudo systemctl status postgresql
sudo -u postgres psql -d student_gear_shop
```

**Nginx issues:**
```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl reload nginx
```

---

## 📝 Important URLs

- GitHub Repo: https://github.com/vishvmkr-cmd/nammagear
- Domain Registrar: (Check hPanel for DNS settings)
- Cloudinary Dashboard: https://cloudinary.com/console

---

**Need help?** Check the logs first with `pm2 logs`!
