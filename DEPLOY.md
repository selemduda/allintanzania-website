# Deploying to DigitalOcean

The whole site runs on one Droplet with Docker: Postgres, the website, and Caddy for HTTPS. For testing we use a free `sslip.io` address, so you don't need a domain yet.

## 1. Create the Droplet

In DigitalOcean, create a Droplet:

- **Image**: Marketplace → *Docker on Ubuntu*
- **Size**: Basic, 2 vCPU / 4 GB RAM (building the site needs about 4 GB)
- **Region**: Frankfurt or Amsterdam (close to Norway and East Africa)
- **Authentication**: your SSH key

Note the Droplet's IP address, for example `164.90.1.2`. Your test address is then `164-90-1-2.sslip.io`. sslip.io turns the IP into a hostname that HTTPS certificates can be issued for.

## 2. Get the code onto the Droplet

```bash
ssh root@164.90.1.2
git clone https://github.com/selemduda/allintanzania-website.git
cd allintanzania-website
```

The repository is private, so GitHub asks you to sign in. Use a [personal access token](https://github.com/settings/tokens) with read access to the repository as the password.

## 3. Settings

```bash
cp .env.example .env
nano .env
```

Fill in at least:

| Setting | Value |
| --- | --- |
| `PAYLOAD_SECRET` | output of `openssl rand -hex 32` |
| `POSTGRES_PASSWORD` | output of `openssl rand -hex 16` |
| `SITE_DOMAIN` | `164-90-1-2.sslip.io` |
| `NEXT_PUBLIC_SERVER_URL` | `https://164-90-1-2.sslip.io` |
| `ANTHROPIC_API_KEY` | from [platform.claude.com](https://platform.claude.com) → API keys, for the AI expert |
| `SEED_ADMIN_EMAIL` | your email, to create the first admin user |

Leave `DATABASE_URL` as it is; docker compose sets it. Optional: `ELEVENLABS_API_KEY` for a natural voice, `SMTP_*` to email enquiries to the team, and `S3_*` to keep photos in DigitalOcean Spaces.

## 4. Start it

```bash
docker compose up -d --build
docker compose --profile tools run --rm seed
```

The first build takes about 5 minutes. The seed loads the starter content and photos, and prints the admin password if `SEED_ADMIN_EMAIL` was set. Write it down and change it after logging in.

Open `https://164-90-1-2.sslip.io` for the site and `https://164-90-1-2.sslip.io/admin` for the admin.

## Updating

```bash
cd allintanzania-website
git pull
docker compose up -d --build
```

Database changes are applied automatically when the new version starts.

## Backups

Turn on Droplet backups in DigitalOcean. For an extra database copy:

```bash
docker compose exec db pg_dump -U allintanzania allintanzania | gzip > backup-$(date +%F).sql.gz
```

Photos live in the `media` Docker volume, or in Spaces if that is configured.

## Going live on allintanzania.com later

1. Point the domain's A record (and `www`) to the Droplet's IP.
2. Change `SITE_DOMAIN` to `allintanzania.com` and `NEXT_PUBLIC_SERVER_URL` to `https://allintanzania.com` in `.env`.
3. Run `docker compose up -d --build`. Caddy fetches the certificate automatically.
