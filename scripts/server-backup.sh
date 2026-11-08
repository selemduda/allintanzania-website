#!/usr/bin/env bash
# Packs everything the site needs to move to another server into ~/aitz-move.tgz:
# the database, uploaded photos and price lists, and this folder with its .env.
#   bash scripts/server-backup.sh
set -euo pipefail
cd "$(dirname "$0")/.."
project=$(basename "$PWD")
out="$HOME/aitz-move"
rm -rf "$out" "$out.tgz"
mkdir -p "$out"

echo "Saving the database..."
docker compose exec -T db pg_dump -U allintanzania -Fc allintanzania > "$out/db.dump"
echo "Saving uploaded photos and files..."
docker compose cp app:/app/media "$out/media"
docker compose cp app:/app/private "$out/private"
echo "Saving the site folder and settings..."
tar -C .. --exclude="$project/gallery-import" -czf "$out/project.tgz" "$project"
[ -f "$HOME/.git-credentials" ] && cp "$HOME/.git-credentials" "$out/"

tar -C "$HOME" -czf "$out.tgz" aitz-move
rm -rf "$out"
echo "Done: $(du -h "$out.tgz" | cut -f1) in $out.tgz"
