# Deploying to DigitalOcean

The whole site runs on one Droplet with Docker: Postgres, the website, and Caddy for HTTPS. For testing we use a free `sslip.io` address, so you don't need a domain yet.

## 1. Create the Droplet

In DigitalOcean, create a Droplet:

- **Image**: *Ubuntu 24.04 (LTS)* (the setup script installs Docker), or *Docker* from the Solutions/Marketplace tab
- **Size**: Basic, 2 vCPU / 4 GB RAM (building the site needs about 4 GB)
- **Region**: London, Frankfurt or Amsterdam (close to Norway and East Africa)
- **Authentication**: your SSH key

Note the Droplet's IP address, for example `164.90.1.2`. Your test address is then `164-90-1-2.sslip.io`. sslip.io turns the IP into a hostname that HTTPS certificates can be issued for.

## 2. Get the code onto the Droplet

```bash
ssh root@164.90.1.2
git clone https://github.com/selemduda/allintanzania-website.git
cd allintanzania-website
```

The repository is private, so GitHub asks you to sign in. Use a [personal access token](https://github.com/settings/tokens) with read access to the repository as the password.

## 3. Quick setup (recommended)

```bash
bash scripts/setup-droplet.sh
```

It asks for your admin email, Claude API key and ElevenLabs key (typing is hidden), writes `.env`, starts the site and loads the starter content. When it finishes it prints your web address and the admin password. You can then skip to **Connect Dropbox**, or read on for the manual steps.

## 3b. Settings (manual)

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

## 4. Start it (manual)

```bash
docker compose up -d --build
docker compose --profile tools run --rm seed
```

The first build takes about 5 minutes. The seed loads the starter content and photos, and prints the admin password if `SEED_ADMIN_EMAIL` was set. Write it down and change it after logging in.

Open `https://164-90-1-2.sslip.io` for the site and `https://164-90-1-2.sslip.io/admin` for the admin.

## Connect Dropbox (photo import)

The admin has an **Import photos from Dropbox** screen (Media → Import photos from Dropbox) where staff tick photos and copy them into the website. To connect it:

1. Go to [dropbox.com/developers/apps](https://www.dropbox.com/developers/apps) → **Create app** → *Scoped access* → *Full Dropbox* → name it, e.g. `allintanzania-website`.
2. On the **Permissions** tab tick `files.metadata.read` and `files.content.read`, then **Submit**.
3. On the **Settings** tab copy the *App key* and *App secret*.
4. Open this address in your browser (with your app key filled in), allow access, and copy the code it shows:
   `https://www.dropbox.com/oauth2/authorize?client_id=APP_KEY&response_type=code&token_access_type=offline`
5. On the Droplet, swap in your key, secret and code and run:
   ```bash
   curl https://api.dropboxapi.com/oauth2/token -d code=CODE -d grant_type=authorization_code -u APP_KEY:APP_SECRET
   ```
   Copy the `refresh_token` from the reply.
6. In `.env` set `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN`, and `DROPBOX_FOLDER=/AllinTanzania` so staff only see the company folder. Then run `docker compose up -d`.

## Updating

```bash
cd allintanzania-website
git pull
docker compose up -d --build
docker compose --profile tools build seed
```

Database changes are applied automatically when the new version starts.

Forgot the admin password? This gives the `SEED_ADMIN_EMAIL` account a new one and prints it:

```bash
docker compose --profile tools run --rm -e RESET_ADMIN_PASSWORD=1 seed
```

## Backups

Turn on Droplet backups in DigitalOcean. For an extra database copy:

```bash
docker compose exec db pg_dump -U allintanzania allintanzania | gzip > backup-$(date +%F).sql.gz
```

Photos live in the `media` Docker volume, or in Spaces if that is configured.

## Going live on allintanzania.com later

1. Point the domain's A record (and `www`) to the Droplet's IP.
2. Change `SITE_DOMAIN` to `allintanzania.com` and `NEXT_PUBLIC_SERVER_URL` to `https://allintanzania.com` in `.env`, and set `SITE_INDEXABLE=true` so search engines may index the site (the test site keeps it off).
3. Run `docker compose up -d --build`. Caddy fetches the certificate automatically.
4. Add the site to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters) (Bing also feeds DuckDuckGo and Ecosia), and submit `https://allintanzania.com/sitemap.xml` in both.
