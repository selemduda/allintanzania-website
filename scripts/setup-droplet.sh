#!/usr/bin/env bash
# First-time setup on a DigitalOcean Docker Droplet. Run from the repository folder:
#   bash scripts/setup-droplet.sh
# It asks for your keys (typing is hidden), writes .env, starts the site and loads the starter content.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -f .env ]; then
  echo ".env already exists. To change a setting, edit it with: nano .env"
  exit 1
fi

ip=$(curl -fsS https://api.ipify.org || hostname -I | awk '{print $1}')
echo "Droplet IP: $ip"
echo "If you made a (sub)domain for this site, its DNS A record must already point to $ip."
read -rp "Domain, e.g. allintanzania.seltechtz.com (press Enter to use a free sslip.io address): " domain
domain="${domain:-${ip//./-}.sslip.io}"

echo "Your test address will be: https://$domain"
read -rp "Admin email (for the first admin login): " admin_email
read -rsp "Claude API key (starts with sk-ant-, hidden): " anthropic_key; echo
read -rsp "ElevenLabs API key (hidden, press Enter to skip): " elevenlabs_key; echo

cat > .env <<ENV
PAYLOAD_SECRET=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -hex 16)
SITE_DOMAIN=$domain
NEXT_PUBLIC_SERVER_URL=https://$domain
ANTHROPIC_API_KEY=$anthropic_key
EXPERT_EFFORT=low
ELEVENLABS_API_KEY=$elevenlabs_key
SEED_ADMIN_EMAIL=$admin_email
ENV
chmod 600 .env

# Small Droplets can run out of memory while building; add swap once.
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "Building and starting the site (about 5 minutes)..."
docker compose up -d --build
echo "Loading starter content and photos..."
docker compose --profile tools run --rm seed

echo
echo "Done. Website: https://$domain   Admin: https://$domain/admin"
echo "Log in with the admin email and the password printed above, then change it."
echo "Next: in the admin, open Settings > AI safari expert > Voice, choose ElevenLabs and paste your Voice ID."
