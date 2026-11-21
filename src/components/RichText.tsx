import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

export function RichText({ data }: { data?: unknown }) {
  if (!data || typeof data !== 'object') return null
  return (
    <div className="prose">
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
