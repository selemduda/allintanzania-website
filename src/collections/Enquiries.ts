import type { CollectionConfig } from 'payload'

import { salesTeam } from '../access/roles'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Sales',
    defaultColumns: ['name', 'email', 'source', 'status', 'estimateTotal', 'createdAt'],
  },
  access: {
    // Visitors submit through the site's own API routes, which use the server-side Local API.
    create: salesTeam,
    read: salesTeam,
    update: salesTeam,
    delete: salesTeam,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'text' },
        { name: 'travelMonth', type: 'text' },
        { name: 'adults', type: 'number' },
        { name: 'children', type: 'number' },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'trip',
      type: 'json',
      admin: { description: 'The dream trip the visitor built (parks, nights, lodge level).' },
    },
    { name: 'estimateTotal', type: 'number', admin: { description: 'Estimated total in USD' } },
    { name: 'estimate', type: 'json' },
    { name: 'chatTranscript', type: 'json', admin: { condition: (data) => Boolean(data?.chatTranscript) } },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'contact',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Contact form', value: 'contact' },
        { label: 'Trip builder', value: 'builder' },
        { label: 'AI expert', value: 'ai' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
