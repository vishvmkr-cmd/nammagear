# Deployment Guide — Student Gear Shop

## Local Docker Stack

```bash
# From repo root
cp deploy/env.example deploy/.env
# Edit deploy/.env: JWT_SECRET, Cloudinary keys, CORS_ORIGIN, COOKIE_DOMAIN

pnpm compose:up    # builds + runs postgres + api + web
# Open http://localhost:3000
```

## Hostinger VPS Deploy (Ubuntu 22.04)

### 1. Provision VPS (hPanel)
- **VPS** → order (e.g. Mumbai DC id=13, 2GB RAM min)
- After provisioned: `hapi vps vm list` shows VM ID
- Set root password: `hapi vps vm set-root-password --vm-id <ID> --password <pw>`
- Get IP: `hapi vps vm get --vm-id <ID> --format json | jq -r .ip_address`

### 2. Initial server setup
```bash
ssh root@<VPS_IP>
apt update && apt upgrade -y && apt install -y git curl ufw

# Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
usermod -aG docker root

# Firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

### 3. Deploy app
```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/student-gear-shop.git app
cd app/deploy
cp env.example .env
nano .env  # real secrets: JWT_SECRET (32+ chars), Cloudinary, CORS_ORIGIN=https://microlynk.shop,https://www.microlynk.shop, COOKIE_DOMAIN=.microlynk.shop

docker compose up -d
docker compose logs -f
```

### 4. Reverse proxy + SSL (Caddy)
```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy

cat > /etc/caddy/Caddyfile << 'EOF'
microlynk.shop, www.microlynk.shop {
    reverse_proxy localhost:3000
    encode gzip
}
EOF

systemctl enable --now caddy
systemctl restart caddy
```

### 5. DNS (hPanel → Domains → microlynk.shop → Manage DNS)
```
A     @           <VPS_IP>   (TTL 3600)
A     www         <VPS_IP>   (TTL 3600)
```
Wait ~5min for propagation. Caddy auto-provisions Let's Encrypt TLS.

### 6. Verify
```bash
curl -I https://microlynk.shop
docker compose ps
docker compose logs api
```

## Updates
```bash
cd /opt/app
git pull
docker compose -f deploy/docker-compose.yml up -d --build
```

## DB migrations (production)
Migrations are in `apps/api/prisma/migrations/`. On first deploy to existing DB that used `db push`:
```bash
cd /opt/app
docker compose exec api npx prisma migrate resolve --applied 20260421120000_init
```
Future schema changes: commit new migration, `git pull`, restart compose (entrypoint runs `migrate deploy`).
