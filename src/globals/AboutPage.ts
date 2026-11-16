import type { GlobalConfig } from 'payload'

import { anyone, editors } from '../access/roles'

/**
 * Everything on /about. Every text field is translated (switch the language at the top of the
 * admin to edit the Norwegian version). Empty texts fall back to the built-in wording.
 */
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: {
    group: 'Content',
    description: 'The About us page. Switch the language at the top to edit the Norwegian version.',
  },
  access: { read: anyone, update: editors },
  fields: [
    {
      type: 'collapsible',
      label: 'Top of the page',
      fields: [
        {
          name: 'showLogo',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show the All in Tanzania logo above the heading.' },
        },
        { name: 'heading', type: 'text', localized: true },
        { name: 'intro', label: 'Intro text', type: 'textarea', localized: true },
        {
          name: 'image',
          label: 'Large photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional. Shown full width under the intro text.' },
        },
      ],
    },
    {
      name: 'sections',
      label: 'Story sections',
      type: 'array',
      admin: {
        description: 'Text blocks with an optional photo, e.g. "Our story", "Our guides", "Our office in Norway".',
        initCollapsed: true,
      },
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', label: 'Text', type: 'textarea', localized: true, required: true },
        { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'values',
      label: 'Why travel with us',
      type: 'array',
      admin: { description: 'The boxes on the dark band.', initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'body', label: 'Text', type: 'textarea', localized: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Bottom of the page',
      fields: [{ name: 'closingHeading', label: 'Closing heading', type: 'text', localized: true }],
    },
    {
      type: 'collapsible',
      label: 'Search engines',
      admin: { initCollapsed: true },
      fields: [
        { name: 'metaTitle', label: 'Page title', type: 'text', localized: true },
        { name: 'metaDescription', label: 'Description', type: 'textarea', localized: true },
      ],
    },
  ],
}
