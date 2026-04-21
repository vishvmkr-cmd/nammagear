#!/usr/bin/env bash
set -euo pipefail
# VPS bootstrap for Ubuntu 22.04+ (run as root on fresh Hostinger VPS)

echo "[1/5] System update + dependencies"
apt-get update && apt-get upgrade -y
apt-get install -y git curl ufw ca-certificates gnupg lsb-release

echo "[2/5] Docker install"
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
  usermod -aG docker root
  echo "Docker installed."
else
  echo "Docker already installed."
fi

echo "[3/5] Firewall (UFW)"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status

echo "[4/5] Caddy (reverse proxy + TLS)"
if ! command -v caddy &>/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update && apt-get install -y caddy
  systemctl enable caddy
  echo "Caddy installed."
else
  echo "Caddy already installed."
fi

echo "[5/5] Clone repo (you'll need to configure deploy/.env and Caddyfile manually)"
cd /opt
if [ ! -d app ]; then
  echo "Enter your GitHub repo URL (e.g. https://github.com/user/student-gear-shop.git):"
  read -r REPO_URL
  git clone "$REPO_URL" app
  cd app/deploy
  cp env.example .env
  echo "✅ Repo cloned to /opt/app. Next steps:"
  echo "  1. nano /opt/app/deploy/.env  # add JWT_SECRET, Cloudinary, CORS_ORIGIN, COOKIE_DOMAIN"
  echo "  2. Configure /etc/caddy/Caddyfile for your domain"
  echo "  3. systemctl restart caddy"
  echo "  4. cd /opt/app && docker compose -f deploy/docker-compose.yml up -d"
else
  echo "/opt/app already exists; skipping clone."
fi

echo ""
echo "✅ VPS bootstrap complete. Configure secrets + Caddy, then start Docker Compose."
