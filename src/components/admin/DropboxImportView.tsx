import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

import { hasRole, type Role } from '../../access/roles'
import { DropboxBrowser } from './DropboxBrowser'

/** Admin screen at /admin/dropbox-import: browse the company Dropbox and copy photos into the media library. */
export function DropboxImportView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  if (!req.user) redirect('/admin/login')
  const allowed = hasRole(req.user as { roles?: Role[] }, 'admin', 'editor')
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <h1 style={{ margin: '24px 0 8px' }}>Import photos from Dropbox</h1>
        <p style={{ maxWidth: 680, opacity: 0.75 }}>
          Browse the company Dropbox and tick the photos you want on the website. They are copied into the media library,
          resized for the web, and stay linked to their Dropbox file so nothing is imported twice.
        </p>
        {allowed ? <DropboxBrowser /> : <p>Only admins and editors can import photos.</p>}
      </Gutter>
    </DefaultTemplate>
  )
}
