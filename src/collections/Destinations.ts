import type { CollectionConfig } from 'payload'

import { editors, publishedOrStaff } from '../access/roles'
import { slugField } from '../lib/slug'

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    group: 'Safari',
    defaultColumns: ['name', 'region', 'type', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: { drafts: true },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'region',
          type: 'select',
          options: [
            { label: 'Northern Circuit', value: 'northern' },
            { label: 'Southern & Western', value: 'southern' },
            { label: 'Coast & Islands', value: 'coast' },
            { label: 'Mountains', value: 'mountains' },
          ],
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'National Park', value: 'park' },
            { label: 'Conservation Area', value: 'conservation' },
            { label: 'Game Reserve', value: 'reserve' },
            { label: 'Beach & Island', value: 'beach' },
            { label: 'Mountain', value: 'mountain' },
            { label: 'Town', value: 'town' },
          ],
        },
        { name: 'order', type: 'number', defaultValue: 100, admin: { description: 'Lower shows first' } },
      ],
    },
    { name: 'tagline', type: 'text', admin: { description: 'One line shown on cards, e.g. "Endless plains and the Great Migration"' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'body', type: 'richText' },
    {
      name: 'highlights',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'wildlife',
      type: 'text',
      hasMany: true,
      admin: { description: 'Animals guests are likely to see' },
    },
    {
      name: 'bestMonths',
      type: 'select',
      hasMany: true,
      options: MONTHS.map((m) => ({ label: m, value: m })),
    },
    {
      name: 'recommendedNights',
      type: 'number',
      defaultValue: 2,
      admin: { description: 'Used by the trip builder and the AI expert as a starting suggestion' },
    },
    {
      name: 'expertNotes',
      type: 'textarea',
      admin: {
        description:
          'Private tips for the AI safari expert (not shown on the website): insider knowledge, which camps to recommend, what to warn about.',
      },
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      type: 'row',
      fields: [
        { name: 'latitude', type: 'number', admin: { description: 'For the map, e.g. -2.33' } },
        { name: 'longitude', type: 'number', admin: { description: 'e.g. 34.83' } },
      ],
    },
  ],
}
