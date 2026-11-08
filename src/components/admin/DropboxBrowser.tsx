'use client'

import { Button } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

type Entry = { type: 'folder' | 'image'; name: string; path: string; size?: number; imported: boolean }
type Listing = { configured: boolean; root?: string; path?: string; entries?: Entry[]; error?: string }

const mb = (bytes?: number) => (bytes ? `${(bytes / 1_000_000).toFixed(1)} MB` : '')

export function DropboxBrowser() {
  const [listing, setListing] = useState<Listing | null>(null)
  const [path, setPath] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<{ done: number; total: number; failed: string[] } | null>(null)

  const fetchListing = useCallback(async (target: string | null): Promise<Listing> => {
    const res = await fetch(`/api/media/dropbox/list${target !== null ? `?path=${encodeURIComponent(target)}` : ''}`, {
      credentials: 'include',
    })
    const data = await res.json().catch(() => ({ error: 'Could not reach the server' }))
    return res.ok ? data : { configured: true, error: data.error || 'Could not open this folder' }
  }, [])

  const go = (target: string) => {
    setListing(null)
    setSelected(new Set())
    setPath(target)
  }

  useEffect(() => {
    let current = true
    fetchListing(path).then((l) => current && setListing(l))
    return () => {
      current = false
    }
  }, [fetchListing, path])

  if (!listing) return <p>Opening Dropbox…</p>
  if (!listing.configured) {
    return (
      <div style={{ maxWidth: 680, padding: 20, border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
        <h3>Dropbox is not connected yet</h3>
        <p>
          Your developer adds <code>DROPBOX_APP_KEY</code>, <code>DROPBOX_APP_SECRET</code>, <code>DROPBOX_REFRESH_TOKEN</code> and
          optionally <code>DROPBOX_FOLDER</code> to the server settings. See DEPLOY.md, section &quot;Connect Dropbox&quot;.
        </p>
      </div>
    )
  }
  if (listing.error) return <p style={{ color: 'var(--theme-error-500)' }}>{listing.error}</p>

  const current = listing.path || '/'
  const root = listing.root || '/'
  const crumbs = current
    .slice(root === '/' ? 0 : root.length)
    .split('/')
    .filter(Boolean)
  const folders = listing.entries?.filter((e) => e.type === 'folder') ?? []
  const images = listing.entries?.filter((e) => e.type === 'image') ?? []
  const importable = images.filter((e) => !e.imported)

  const toggle = (p: string) =>
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(p)) next.delete(p)
      else next.add(p)
      return next
    })

  async function importSelected() {
    const paths = [...selected]
    const failed: string[] = []
    setProgress({ done: 0, total: paths.length, failed })
    // A few at a time: each photo is downloaded and resized on the server.
    for (let i = 0; i < paths.length; i += 3) {
      const batch = paths.slice(i, i + 3)
      const res = await fetch('/api/media/dropbox/import', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: batch }),
      })
      const data = (await res.json().catch(() => ({}))) as { results?: { path: string; error?: string }[] }
      for (const r of data.results ?? batch.map((path) => ({ path, error: 'failed' }))) if (r.error) failed.push(r.path)
      setProgress({ done: Math.min(i + 3, paths.length), total: paths.length, failed: [...failed] })
    }
    setListing(await fetchListing(listing?.path ?? null))
    setSelected(new Set())
  }

  return (
    <div>
      <nav style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '16px 0', alignItems: 'center' }}>
        <button type="button" className="btn btn--style-subtle btn--size-small" style={{ margin: 0 }} onClick={() => go(root)}>
          {root === '/' ? 'Dropbox' : root.split('/').pop()}
        </button>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span>/</span>
            <button
              type="button"
              className="btn btn--style-subtle btn--size-small"
              style={{ margin: 0 }}
              onClick={() => go((root === '/' ? '' : root) + '/' + crumbs.slice(0, i + 1).join('/'))}
            >
              {c}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {folders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 24 }}>
          {folders.map((f) => (
            <button
              key={f.path}
              type="button"
              onClick={() => go(f.path)}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid var(--theme-elevation-150)',
                background: 'var(--theme-elevation-50)',
                cursor: 'pointer',
                color: 'inherit',
                font: 'inherit',
              }}
            >
              📁 {f.name}
            </button>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <strong>
              {images.length} photo{images.length > 1 ? 's' : ''}
              {images.length > importable.length ? `, ${images.length - importable.length} already imported` : ''}
            </strong>
            <Button
              buttonStyle="secondary"
              size="small"
              margin={false}
              onClick={() => setSelected(selected.size === importable.length ? new Set() : new Set(importable.map((e) => e.path)))}
            >
              {selected.size === importable.length && importable.length ? 'Clear selection' : 'Select all new'}
            </Button>
            <Button size="small" margin={false} disabled={!selected.size || Boolean(progress && progress.done < progress.total)} onClick={importSelected}>
              Import {selected.size || ''} selected
            </Button>
            {progress && (
              <span>
                {progress.done < progress.total ? `Importing ${progress.done} of ${progress.total}…` : `Imported ${progress.total - progress.failed.length} of ${progress.total}.`}
                {progress.failed.length > 0 && ` ${progress.failed.length} failed.`}
              </span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {images.map((img) => {
              const on = selected.has(img.path)
              return (
                <label
                  key={img.path}
                  style={{
                    display: 'block',
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: `2px solid ${on ? 'var(--theme-success-500)' : 'var(--theme-elevation-100)'}`,
                    opacity: img.imported ? 0.5 : 1,
                    cursor: img.imported ? 'default' : 'pointer',
                  }}
                >
                  <img
                    src={`/api/media/dropbox/thumbnail?path=${encodeURIComponent(img.path)}`}
                    alt={img.name}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block', background: 'var(--theme-elevation-100)' }}
                  />
                  <span style={{ display: 'flex', gap: 6, padding: '6px 8px', fontSize: 12, alignItems: 'center' }}>
                    <input type="checkbox" checked={on || img.imported} disabled={img.imported} onChange={() => toggle(img.path)} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={img.name}>
                      {img.imported ? 'Imported · ' : ''}
                      {img.name}
                    </span>
                    <span style={{ opacity: 0.6 }}>{mb(img.size)}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </>
      )}
      {!folders.length && !images.length && <p>This folder has no photos.</p>}
    </div>
  )
}
