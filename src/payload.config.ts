import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Destinations } from './collections/Destinations'
import { Enquiries } from './collections/Enquiries'
import { ExpertChats } from './collections/ExpertChats'
import { Itineraries } from './collections/Itineraries'
import { Lodges } from './collections/Lodges'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { PriceLists } from './collections/PriceLists'
import { Users } from './collections/Users'
import { migrations } from './migrations'
import { ExpertSettings } from './globals/ExpertSettings'
import { HomePage } from './globals/HomePage'
import { PricingSettings } from './globals/PricingSettings'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · All in Tanzania',
      icons: [{ rel: 'icon', type: 'image/png', url: '/favicon.png' }],
    },
  },
  collections: [
    Destinations,
    Lodges,
    Itineraries,
    Posts,
    Media,
    Enquiries,
    ExpertChats,
    PriceLists,
    Users,
  ],
  globals: [HomePage, SiteSettings, PricingSettings, ExpertSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // In development the schema is pushed automatically; production applies these on start-up.
    prodMigrations: migrations,
  }),
  sharp,
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'website@allintanzania.com',
        defaultFromName: 'All in Tanzania website',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  plugins: [
    // Photos go to DigitalOcean Spaces in production; local disk when not configured.
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'fra1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
