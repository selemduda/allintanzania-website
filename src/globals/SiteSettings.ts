import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: editors },
  fields: [
    { name: 'companyName', type: 'text', defaultValue: 'All in Tanzania' },
    { name: 'tagline', type: 'text', localized: true, defaultValue: 'Your choice. Your holiday. Our mission.' },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'whatsapp', type: 'text', admin: { description: 'International format, e.g. +255712345678' } },
      ],
    },
    { name: 'address', type: 'textarea' },
    {
      name: 'social',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: ['Instagram', 'Facebook', 'YouTube', 'TikTok', 'TripAdvisor', 'LinkedIn', 'X'].map((p) => ({
                label: p,
                value: p.toLowerCase(),
              })),
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'enquiryRecipients',
      type: 'text',
      hasMany: true,
      admin: { description: 'Who gets an email when a visitor sends an enquiry.' },
    },
    { name: 'footerNote', type: 'textarea', localized: true },
  ],
}
