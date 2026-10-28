import type { GlobalConfig } from 'payload'

import { admins, loggedIn } from '../access/roles'
import { MONTHS } from '../collections/Destinations'

export const PricingSettings: GlobalConfig = {
  slug: 'pricing-settings',
  label: 'Pricing rules',
  admin: {
    group: 'Sales',
    description: 'How the trip estimator turns your price list into a quote.',
  },
  // Markup and fallbacks are commercial info; the site reads them server-side only.
  access: { read: loggedIn, update: admins },
  fields: [
    {
      name: 'showPrices',
      type: 'checkbox',
      label: 'Show prices on the website',
      defaultValue: false,
      admin: {
        description:
          'When off, visitors see "price on request": the trip builder and the AI expert collect trip details and send them to the team for a quote. Staff still see the internal estimate on each enquiry. Turn on once your real price list is uploaded.',
      },
    },
    {
      name: 'seasons',
      type: 'group',
      admin: { description: 'Which season each month falls in.' },
      fields: [
        {
          type: 'row',
          fields: MONTHS.map((m, i) => ({
            name: m.toLowerCase(),
            label: m,
            type: 'select' as const,
            required: true,
            defaultValue: [6, 7, 8, 11].includes(i) ? 'peak' : [0, 1, 2, 5, 9].includes(i) ? 'high' : 'low',
            options: ['low', 'high', 'peak'],
            admin: { width: '8%' },
          })),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'markupPercent', type: 'number', defaultValue: 20, admin: { description: 'Added on top of costs' } },
        { name: 'vehicleCapacity', type: 'number', defaultValue: 6, admin: { description: 'Guests per safari vehicle' } },
        {
          name: 'rangePercent',
          type: 'number',
          defaultValue: 10,
          admin: { description: 'Show estimates as a range of ± this percent' },
        },
        { name: 'childAgeLimit', type: 'number', defaultValue: 15 },
      ],
    },
    {
      name: 'fallbackLodgeRates',
      type: 'group',
      admin: {
        description:
          'Used when the price list has no rate for a lodge in a park. USD per person per night sharing.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'comfort', type: 'number', defaultValue: 180 },
            { name: 'classic', type: 'number', defaultValue: 380 },
            { name: 'luxury', type: 'number', defaultValue: 950 },
          ],
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      defaultValue:
        'This is an estimate based on our current rates and typical availability. Your safari expert will confirm the final price.',
    },
  ],
}
