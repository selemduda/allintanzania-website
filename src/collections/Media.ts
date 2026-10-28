import type { CollectionConfig } from 'payload'

import { anyone, editors } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'source', 'updatedAt'],
  },
  // Lets the team organise photos into folders (e.g. Serengeti, Lodges, Wildlife).
  folders: true,
  access: {
    read: anyone,
    create: editors,
    update: editors,
    delete: editors,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Short description of the photo for search engines and screen readers.' },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer or guide who took the photo.' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'upload',
      admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: 'Uploaded', value: 'upload' },
        { label: 'Dropbox', value: 'dropbox' },
        { label: 'Sample', value: 'sample' },
      ],
    },
    {
      name: 'dropboxPath',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true, condition: (data) => data?.source === 'dropbox' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 320, position: 'centre' },
      { name: 'card', width: 900, height: 640, position: 'centre' },
      { name: 'hero', width: 2400, withoutEnlargement: true },
    ],
    adminThumbnail: 'thumbnail',
  },
}
