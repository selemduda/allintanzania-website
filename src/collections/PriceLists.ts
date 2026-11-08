import type { CollectionConfig } from 'payload'

import { admins, salesTeam } from '../access/roles'
import { parsePriceFile } from '../lib/priceList'

export const PriceLists: CollectionConfig = {
  slug: 'price-lists',
  admin: {
    useAsTitle: 'name',
    group: 'Sales',
    defaultColumns: ['name', 'active', 'rowCount', 'updatedAt'],
    description:
      'Upload your rate sheet (Excel or CSV). Download the template from /price-list-template.csv to see the columns. The active list drives the trip estimator and the AI expert.',
  },
  access: {
    read: salesTeam,
    create: admins,
    update: admins,
    delete: admins,
  },
  upload: {
    staticDir: 'private/price-lists',
    mimeTypes: [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "2027 rates v1"' } },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Only one list is active at a time.' },
    },
    { name: 'rowCount', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'parseErrors',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Rows that could not be read. Fix them in the sheet and upload again.',
        condition: (data) => Array.isArray(data?.parseErrors) && data.parseErrors.length > 0,
      },
    },
    {
      name: 'rates',
      type: 'json',
      admin: { readOnly: true, description: 'Rates read from the file.' },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        const file = req.file
        if (file?.data) {
          const { rows, errors } = await parsePriceFile(file.data, file.name)
          data.rates = rows
          data.rowCount = rows.length
          data.parseErrors = errors
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        if (!doc.active) return doc
        await req.payload.update({
          collection: 'price-lists',
          where: { and: [{ active: { equals: true } }, { id: { not_equals: doc.id } }] },
          data: { active: false },
          req,
        })
        return doc
      },
    ],
  },
}
