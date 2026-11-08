/**
 * Minimal Dropbox API client for importing photos into the media library.
 * Uses a long-lived refresh token from a Dropbox app (see DEPLOY.md).
 */

const IMAGE = /\.(jpe?g|png|webp|heic|tiff?)$/i

export const dropboxConfigured = () =>
  Boolean(process.env.DROPBOX_APP_KEY && process.env.DROPBOX_APP_SECRET && process.env.DROPBOX_REFRESH_TOKEN)

export const dropboxRoot = () => (process.env.DROPBOX_FOLDER || '').replace(/\/+$/, '')

let token: { value: string; expires: number } | null = null

async function accessToken() {
  if (token && token.expires > Date.now() + 60_000) return token.value
  const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.DROPBOX_REFRESH_TOKEN || '',
      client_id: process.env.DROPBOX_APP_KEY || '',
      client_secret: process.env.DROPBOX_APP_SECRET || '',
    }),
  })
  if (!res.ok) throw new Error(`Dropbox sign-in failed (${res.status})`)
  const data = (await res.json()) as { access_token: string; expires_in: number }
  token = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 }
  return token.value
}

async function rpc<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`https://api.dropboxapi.com/2/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Dropbox ${endpoint} failed (${res.status}): ${await res.text()}`)
  return res.json() as Promise<T>
}

async function content(endpoint: string, arg: unknown) {
  const res = await fetch(`https://content.dropboxapi.com/2/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      // Dropbox wants non-ASCII characters in this header escaped.
      'Dropbox-API-Arg': JSON.stringify(arg).replace(/[\u007f-￿]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`),
    },
  })
  if (!res.ok) throw new Error(`Dropbox ${endpoint} failed (${res.status})`)
  return Buffer.from(await res.arrayBuffer())
}

export type DropboxEntry = { type: 'folder' | 'image'; name: string; path: string; size?: number }

/** Keeps every path inside the configured Dropbox folder. */
export function safePath(path: string) {
  const root = dropboxRoot()
  const clean = ('/' + path).replace(/\/+/g, '/').replace(/\/$/, '')
  if (clean.split('/').includes('..')) throw new Error('Invalid path')
  if (root && clean !== root && !clean.toLowerCase().startsWith(root.toLowerCase() + '/')) return root
  return clean === '/' ? '' : clean
}

export async function listFolder(path: string): Promise<DropboxEntry[]> {
  type Raw = { '.tag': string; name: string; path_display: string; size?: number }
  let page = await rpc<{ entries: Raw[]; cursor: string; has_more: boolean }>('files/list_folder', {
    path: safePath(path),
    limit: 2000,
  })
  const entries = [...page.entries]
  while (page.has_more && entries.length < 5000) {
    page = await rpc('files/list_folder/continue', { cursor: page.cursor })
    entries.push(...page.entries)
  }
  return entries
    .filter((e) => e['.tag'] === 'folder' || (e['.tag'] === 'file' && IMAGE.test(e.name)))
    .map((e) => ({
      type: e['.tag'] === 'folder' ? ('folder' as const) : ('image' as const),
      name: e.name,
      path: e.path_display,
      size: e.size,
    }))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1))
}

export const thumbnail = (path: string) =>
  content('files/get_thumbnail_v2', {
    resource: { '.tag': 'path', path: safePath(path) },
    format: 'jpeg',
    size: 'w256h256',
    mode: 'fitone_bestfit',
  })

export const download = (path: string) => content('files/download', { path: safePath(path) })
