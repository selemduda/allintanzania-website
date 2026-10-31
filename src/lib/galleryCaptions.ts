import path from 'path'

/** Minimal CSV parser: quoted fields, escaped quotes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      if (row.some((f) => f.trim())) rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  row.push(field)
  if (row.some((f) => f.trim())) rows.push(row)
  return rows
}

/** Maps file name to alt text and caption, finding the columns by their header names. */
export function readCaptions(csv: string): Map<string, { alt?: string; caption?: string }> {
  const [header, ...rows] = parseCsv(csv.replace(/^﻿/, ''))
  const out = new Map<string, { alt?: string; caption?: string }>()
  if (!header) return out
  const col = (re: RegExp) => header.findIndex((h) => re.test(h.trim()))
  const file = Math.max(col(/file/i), 0)
  const alt = col(/alt/i)
  const caption = col(/caption/i)
  for (const r of rows) {
    const name = path.basename((r[file] ?? '').trim())
    if (!name) continue
    out.set(name, {
      alt: alt >= 0 ? r[alt]?.trim() || undefined : undefined,
      caption: caption >= 0 ? r[caption]?.trim() || undefined : undefined,
    })
  }
  return out
}

