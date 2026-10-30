import type { CollectionConfig } from 'payload'

import { editors, publishedOrStaff } from '../access/roles'
import { slugField } from '../lib/slug'
import { TIERS } from './Lodges'

export const TRIP_STYLES = [
  { label: 'Great Migration', value: 'migration' },
  { label: 'Classic Safari', value: 'classic' },
  { label: 'Safari & Beach', value: 'beach' },
  { label: 'Honeymoon', value: 'honeymoon' },
  { label: 'Family', value: 'family' },
  { label: 'Kilimanjaro Trek', value: 'kilimanjaro' },
  { label: 'Walking & Wilderness', value: 'walking' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Self-drive', value: 'selfdrive' },
]

export const Itineraries: CollectionConfig = {
  slug: 'itineraries',
  labels: { singular: 'Safari', plural: 'Safaris' },
  admin: {
    useAsTitle: 'title',
    group: 'Safari',
    defaultColumns: ['title', 'durationDays', 'fromPrice', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        { name: 'durationDays', type: 'number', required: true, min: 1 },
        { name: 'tier', type: 'select', options: TIERS, defaultValue: 'classic' },
        {
          name: 'fromPrice',
          type: 'number',
          admin: { description: 'USD per person sharing. Leave empty to calculate from the price list.' },
        },
      ],
    },
    { name: 'styles', type: 'select', hasMany: true, options: TRIP_STYLES },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video/' } },
      admin: { description: 'Short MP4 clip from the trip, shown above the day-by-day. Keep it under 50 MB.' },
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'summary', type: 'textarea', localized: true, required: true },
    {
      name: 'days',
      type: 'array',
      labels: { singular: 'Stop', plural: 'Day-by-day' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'dayRange', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Day 1" or "Days 2–3"' } },
            { name: 'title', type: 'text', localized: true, required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'destination', type: 'relationship', relationTo: 'destinations' },
            { name: 'lodge', type: 'relationship', relationTo: 'lodges' },
            { name: 'nights', type: 'number', defaultValue: 1, min: 0 },
          ],
        },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    { name: 'included', type: 'text', localized: true, hasMany: true },
    { name: 'excluded', type: 'text', localized: true, hasMany: true },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
  ],
}
