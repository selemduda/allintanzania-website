# All in Tanzania website

Safari website, admin and booking enquiries for All in Tanzania, built with Next.js and Payload CMS.

- **Website**: destinations, safaris, lodges, journal, trip builder (`/plan`) and the AI safari expert (`/expert`).
- **Admin** at `/admin`: edit every page and photo, upload price lists, follow up enquiries and expert chats. Roles: admin, editor, sales.
- **Prices**: upload your price list (CSV or Excel, template at `/price-list-template.csv`) under Sales → Price lists. Prices only show on the site when *Show prices on the website* is ticked under Sales → Pricing rules; otherwise visitors see "price on request" and the team gets an internal estimate with each enquiry.
- **AI expert (Baraka)**: answers visitors from the site's own content using Claude, by text or voice, and passes enquiries to the team. Set the name, greeting, personality, facts and voice under Settings → AI safari expert. Needs `ANTHROPIC_API_KEY`.

## Local development

Requires Node 22+ and Postgres.

```bash
cp .env.example .env      # fill in DATABASE_URL and PAYLOAD_SECRET
npm install
npm run dev               # http://localhost:3000, admin at /admin
npm run seed              # optional: load the starter content and photos
npm test
```

In development the database schema follows the code automatically. After changing collections or fields, create a migration for production with `npx payload migrate:create <name>`.

## Deploying

See [DEPLOY.md](DEPLOY.md) for DigitalOcean.
