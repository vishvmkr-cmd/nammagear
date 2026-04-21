# Hostinger CLI Setup Summary

## Status
- Go 1.26.2 installed → `~/.local/go/bin/go`
- Hostinger API CLI → `~/go/bin/hapi` (symlink to `api-cli`)
- Config: `~/.hapi.yaml` (API token active)
- PATH in `~/.zshrc` and `~/.zprofile`

## Verified Commands
```bash
hapi vps data-centers list   # ✅ shows Mumbai, Paris, Frankfurt, etc.
hapi vps vm list              # ✅ (empty — no VPS yet)
```

## VPS Workflow
1. **Order VPS in hPanel** (VPS → pick plan/DC)
2. `hapi vps vm list` → get VM ID
3. `hapi vps vm set-root-password --vm-id <ID> --password <pw>`
4. `hapi vps vm get --vm-id <ID>` → IP address
5. SSH to VPS, run `deploy/vps-install.sh`

## Local Docker
- `deploy/Dockerfile.{api,web}` + `deploy/docker-compose.yml`
- `pnpm compose:up` once Docker Desktop engine is running
- Test: http://localhost:3000

## DNS
Point `microlynk.shop` A/AAAA to VPS IP in hPanel → Domains → DNS

## Notes
- Migration: `apps/api/prisma/migrations/20260421120000_init/migration.sql`
- Compose runs `prisma migrate deploy` on API start
- Caddy auto-renews TLS from Let's Encrypt
