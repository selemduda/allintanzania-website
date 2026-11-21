import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access/roles'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Content' },
  access: { read: anyone, update: editors },
  versions: { drafts: true },
  fields: [
    {
      name: 'heroSlides',
      type: 'array',
      minRows: 1,
      admin: { description: 'Full-screen images that fade on the home page. The first one loads first.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'eyebrow', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true, required: true },
      ],
    },
    { name: 'heroSubheading', type: 'textarea', localized: true },
    {
      name: 'intro',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'featuredDestinations',
      type: 'relationship',
      relationTo: 'destinations',
      hasMany: true,
    },
    {
      name: 'featuredItineraries',
      type: 'relationship',
      relationTo: 'itineraries',
      hasMany: true,
    },
    {
      name: 'pillars',
      label: 'Why travel with us',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', localized: true, required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'origin', type: 'text', localized: true },
      ],
    },
    {
      name: 'expertBanner',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
