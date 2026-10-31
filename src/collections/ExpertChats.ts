import type { CollectionConfig } from 'payload'

import { admins, salesTeam } from '../access/roles'

/** Conversations visitors have with the AI expert, so the sales team can pick up where it left off. */
export const ExpertChats: CollectionConfig = {
  slug: 'expert-chats',
  labels: { singular: 'Expert chat', plural: 'Expert chats' },
  admin: {
    useAsTitle: 'summary',
    group: 'Sales',
    defaultColumns: ['summary', 'turns', 'enquiry', 'updatedAt'],
    description: 'Conversations with the AI safari expert on the website.',
  },
  access: {
    // The website's own API route reads and writes these with the server-side Local API.
    create: () => false,
    read: salesTeam,
    update: () => false,
    delete: admins,
  },
  defaultSort: '-updatedAt',
  fields: [
    { name: 'summary', type: 'text', admin: { description: "The visitor's first question." } },
    { name: 'turns', type: 'number', defaultValue: 0 },
    { name: 'enquiry', type: 'relationship', relationTo: 'enquiries' },
    {
      name: 'transcript',
      type: 'json',
      admin: { description: 'What the visitor and the expert said.' },
    },
    // Secret the visitor's browser holds to continue the chat. Never shown in the admin.
    { name: 'token', type: 'text', index: true, unique: true, admin: { hidden: true } },
    // Full API conversation (tool calls included), needed to continue the chat.
    { name: 'messages', type: 'json', admin: { hidden: true } },
  ],
}
