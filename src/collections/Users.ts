import type { CollectionConfig } from 'payload'

import { adminFieldOnly, admins, hasRole } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Settings',
  },
  auth: true,
  access: {
    // The first user can always be created from the admin welcome screen.
    create: admins,
    delete: admins,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user, 'admin')) return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user, 'admin')) return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      required: true,
      saveToJWT: true,
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      options: [
        { label: 'Admin (everything, incl. users and prices)', value: 'admin' },
        { label: 'Editor (pages, photos, safaris)', value: 'editor' },
        { label: 'Sales (enquiries and chats)', value: 'sales' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        // Make the very first account an admin so the owner is never locked out.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.roles = ['admin']
        }
        return data
      },
    ],
  },
  versions: false,
}
