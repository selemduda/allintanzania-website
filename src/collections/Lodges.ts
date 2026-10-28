import type { CollectionConfig } from 'payload'

import { editors, publishedOrStaff } from '../access/roles'
import { slugField } from '../lib/slug'

export const TIERS = [
  { label: 'Comfort (budget)', value: 'comfort' },
  { label: 'Classic (mid-range)', value: 'classic' },
  { label: 'Luxury', value: 'luxury' },
]

export const Lodges: CollectionConfig = {
  slug: 'lodges',
  admin: {
    useAsTitle: 'name',
    group: 'Safari',
    defaultColumns: ['name', 'destination', 'tier', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: { drafts: true },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'destination', type: 'relationship', relationTo: 'destinations', required: true },
        { name: 'tier', type: 'select', options: TIERS, required: true, defaultValue: 'classic' },
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Tented camp', value: 'tented' },
            { label: 'Lodge', value: 'lodge' },
            { label: 'Mobile camp', value: 'mobile' },
            { label: 'Beach resort', value: 'beach' },
            { label: 'Boutique hotel', value: 'hotel' },
          ],
        },
      ],
    },
    {
      name: 'priceCode',
      type: 'text',
      admin: {
        description:
          'Must match the "item" column for this lodge in your uploaded price list, so the estimator uses its real rates.',
      },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'summary', type: 'textarea', localized: true, required: true },
    { name: 'body', type: 'richText', localized: true },
    { name: 'amenities', type: 'text', localized: true, hasMany: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
  ],
}
