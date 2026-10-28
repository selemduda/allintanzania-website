import type { CollectionConfig } from 'payload'

import { editors, publishedOrStaff } from '../access/roles'
import { slugField } from '../lib/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Journal post', plural: 'Journal' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'publishedAt', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' }, defaultValue: () => new Date() },
    { name: 'author', type: 'text', admin: { position: 'sidebar' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'body', type: 'richText' },
  ],
}
