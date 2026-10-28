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
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text', required: true },
      ],
    },
    { name: 'heroSubheading', type: 'textarea' },
    {
      name: 'intro',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
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
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'origin', type: 'text' },
      ],
    },
    {
      name: 'expertBanner',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
