import type { Endpoint, PayloadRequest } from 'payload'

import { hasRole, type Role } from '../access/roles'
import { download, dropboxConfigured, dropboxRoot, listFolder, thumbnail } from '../lib/dropbox'

const canImport = (req: PayloadRequest) => hasRole(req.user as { roles?: Role[] } | null, 'admin', 'editor')

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  heic: 'image/heic',
}

/** "SelousJuly 158 (2).jpg" -> "Selous July" as a starting point for the alt text. */
export const altFromName = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/\(\d+\)|\bDSC_?\d+\b|\bIMG_?\d+\b|\d+/gi, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim() || 'Safari photo'

const fail = (status: number, error: string) => Response.json({ error }, { status })

/** Admin-only endpoints behind the "Import from Dropbox" screen. */
export const dropboxEndpoints: Omit<Endpoint, 'root'>[] = [
  {
    path: '/dropbox/list',
    method: 'get',
    handler: async (req) => {
      if (!canImport(req)) return fail(403, 'Not allowed')
      if (!dropboxConfigured()) return Response.json({ configured: false })
      const path = req.searchParams.get('path') ?? dropboxRoot()
      try {
        const entries = await listFolder(path)
        const imported = await req.payload.find({
          collection: 'media',
          where: { dropboxPath: { in: entries.filter((e) => e.type === 'image').map((e) => e.path) } },
          limit: 2000,
          depth: 0,
          select: { dropboxPath: true },
        })
        const done = new Set(imported.docs.map((d) => d.dropboxPath))
        return Response.json({
          configured: true,
          root: dropboxRoot() || '/',
          path: path || '/',
          entries: entries.map((e) => ({ ...e, imported: done.has(e.path) })),
        })
      } catch (err) {
        req.payload.logger.error({ err }, 'Dropbox list failed')
        return fail(502, (err as Error).message)
      }
    },
  },
  {
    path: '/dropbox/thumbnail',
    method: 'get',
    handler: async (req) => {
      if (!canImport(req) || !dropboxConfigured()) return fail(403, 'Not allowed')
      try {
        const bytes = await thumbnail(req.searchParams.get('path') ?? '')
        return new Response(new Uint8Array(bytes), {
          headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, max-age=86400' },
        })
      } catch {
        return fail(404, 'No preview')
      }
    },
  },
  {
    path: '/dropbox/import',
    method: 'post',
    handler: async (req) => {
      if (!canImport(req)) return fail(403, 'Not allowed')
      if (!dropboxConfigured()) return fail(400, 'Dropbox is not connected')
      const body = (await req.json?.().catch(() => null)) as { paths?: unknown } | null
      const paths = Array.isArray(body?.paths) ? body.paths.filter((p): p is string => typeof p === 'string').slice(0, 25) : []
      const results: { path: string; id?: number; error?: string }[] = []
      for (const path of paths) {
        try {
          const existing = await req.payload.find({
            collection: 'media',
            where: { dropboxPath: { equals: path } },
            limit: 1,
            depth: 0,
          })
          if (existing.docs[0]) {
            results.push({ path, id: existing.docs[0].id })
            continue
          }
          const name = path.split('/').pop() || 'photo.jpg'
          const data = await download(path)
          const doc = await req.payload.create({
            collection: 'media',
            req,
            data: { alt: altFromName(name), source: 'dropbox', dropboxPath: path },
            file: {
              data,
              name,
              size: data.length,
              mimetype: MIME[name.split('.').pop()?.toLowerCase() ?? ''] ?? 'image/jpeg',
            },
          })
          results.push({ path, id: doc.id })
        } catch (err) {
          req.payload.logger.error({ err }, `Dropbox import failed: ${path}`)
          results.push({ path, error: (err as Error).message })
        }
      }
      return Response.json({ results })
    },
  },
]
