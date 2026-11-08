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
        { name: 'expertTitle', type: 'text', localized: true, defaultValue: 'Safari Expert, Arusha' },
      ],
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'greeting',
      type: 'textarea', localized: true,
      defaultValue:
        "Karibu! I'm Baraka, the All in Tanzania AI safari expert. I've learned from our guides and planners, so ask me anything about parks, seasons, lodges or family trips, by typing or by talking. Tell me what you dream of seeing and we'll shape your safari together.",
    },
    {
      name: 'personality',
      type: 'textarea',
      admin: {
        description:
          'How the expert should speak and behave. Write it like a briefing to a new guide. Not shown on the website.',
      },
      defaultValue:
        'Warm, knowledgeable and honest. Speaks in the style of a seasoned Tanzanian guide: uses the odd Swahili word (karibu, asante, pole pole, hakuna matata) naturally, paints vivid pictures of life in the bush (a dawn game drive, lions calling at night), and is practical about budgets, seasons and travel times. Never pushy. Always recommends our own safaris and partner lodges first.',
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
