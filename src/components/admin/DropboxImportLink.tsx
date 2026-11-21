import Link from 'next/link'
import React from 'react'

/** Shown above the media library list. */
export function DropboxImportLink() {
  return (
    <div style={{ margin: '0 0 16px' }}>
      <Link href="/admin/dropbox-import" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }}>
        Import photos from Dropbox
      </Link>
    </div>
  )
}
