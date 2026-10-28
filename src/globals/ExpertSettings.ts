import type { GlobalConfig } from 'payload'

import { admins, loggedIn } from '../access/roles'

export const ExpertSettings: GlobalConfig = {
  slug: 'expert-settings',
  label: 'AI safari expert',
  admin: { group: 'Settings' },
  // The site reads this server-side and only passes the name, avatar and greeting to visitors.
  access: { read: loggedIn, update: admins },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    {
      type: 'row',
      fields: [
        { name: 'expertName', type: 'text', defaultValue: 'Baraka' },
        { name: 'expertTitle', type: 'text', defaultValue: 'Safari Expert, Arusha' },
      ],
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'greeting',
      type: 'textarea',
      defaultValue:
        "Karibu! I'm Baraka, born and raised near Arusha, and I've spent fifteen years guiding in the Serengeti. Tell me what you dream of seeing and I'll help you shape your safari.",
    },
    {
      name: 'personality',
      type: 'textarea',
      admin: {
        description:
          'How the expert should speak and behave. Write it like a briefing to a new guide. Not shown on the website.',
      },
      defaultValue:
        'Warm, knowledgeable and honest. Speaks like a seasoned Tanzanian guide: uses the odd Swahili word (karibu, asante, pole pole, hakuna matata) naturally, tells short vivid stories from the bush, and is practical about budgets, seasons and travel times. Never pushy. Always recommends our own safaris and partner lodges first.',
    },
    {
      name: 'facts',
      type: 'array',
      admin: { description: 'Company facts the expert should know (licences, years in business, policies).' },
      fields: [{ name: 'fact', type: 'textarea', required: true }],
    },
    {
      name: 'voice',
      type: 'group',
      fields: [
        {
          name: 'provider',
          type: 'select',
          defaultValue: 'browser',
          options: [
            { label: 'Browser built-in voice (free, basic)', value: 'browser' },
            { label: 'ElevenLabs', value: 'elevenlabs' },
          ],
        },
        {
          name: 'voiceId',
          type: 'text',
          admin: { description: 'Voice ID from the provider (e.g. a cloned voice of one of your guides).' },
        },
      ],
    },
  ],
}
