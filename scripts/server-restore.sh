#!/usr/bin/env bash
# Sets the site up on a new Ubuntu server from the package made by server-backup.sh.
# On the new server, with aitz-move.tgz in the home folder:
#   cd ~ && tar -xzf aitz-move.tgz && tar -xzf aitz-move/project.tgz && bash allintanzania-website/scripts/server-restore.sh
set -euo pipefail
cd "$(dirname "$0")/.."
pack="$HOME/aitz-move"
[ -f "$pack/db.dump" ] || { echo "No $pack/db.dump: unpack aitz-move.tgz in your home folder first."; exit 1; }

if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi
# Building the site needs more memory than small servers have; add swap once.
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
if [ -f "$pack/.git-credentials" ]; then
  cp "$pack/.git-credentials" "$HOME/.git-credentials" && chmod 600 "$HOME/.git-credentials"
  git config --global credential.helper store
fi

echo "Restoring the database..."
docker compose up -d --wait db
docker compose exec -T db pg_restore -U allintanzania -d allintanzania --clean --if-exists --no-owner < "$pack/db.dump"

echo "Building the site (about 5 minutes)..."
docker compose build app
echo "Restoring uploaded photos and files..."
docker compose run --rm --no-deps -u root -v "$pack:/restore:ro" --entrypoint sh app -c \
  'cp -a /restore/media/. /app/media/ && cp -a /restore/private/. /app/private/ && chown -R nextjs:nodejs /app/media /app/private'
docker compose up -d

echo
echo "Done. This server's IP: $(curl -fs https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
echo "Point the domain's A records (@ and www) at it; HTTPS starts by itself once DNS has moved."
