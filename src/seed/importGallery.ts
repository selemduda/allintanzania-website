/**
 * Imports prepared gallery photos and clips into the Media library's "Gallery" folder.
 *   npm run import-gallery
 * Reads GALLERY_DIR (default ./gallery-import): photos/*.jpg|png|webp, videos/*.mp4|webm and an
 * optional captions.csv (columns: filename, alt, caption). Files already imported are skipped,
 * so it is safe to re-run after adding or removing files.
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import { readCaptions } from '../lib/galleryCaptions'

const FOLDER = 'Gallery'
const KINDS = [
  { dir: 'photos', ext: /\.(jpe?g|png|webp)$/i },
  { dir: 'videos', ext: /\.(mp4|webm)$/i },
]

const fromFileName = (file: string) =>
  file
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())

async function run() {
  const root = path.resolve(process.env.GALLERY_DIR || 'gallery-import')
  if (!fs.existsSync(root)) throw new Error(`No gallery folder at ${root}`)
  const payload = await getPayload({ config })

  const captionsFile = path.join(root, 'captions.csv')
  const captions = fs.existsSync(captionsFile) ? readCaptions(fs.readFileSync(captionsFile, 'utf8')) : new Map()

  const found = await payload.find({ collection: 'payload-folders', where: { name: { equals: FOLDER } }, limit: 1 })
  const folder =
    found.docs[0] ?? (await payload.create({ collection: 'payload-folders', data: { name: FOLDER, folderType: ['media'] } }))

  let added = 0
  let skipped = 0
  for (const { dir, ext } of KINDS) {
    const full = path.join(root, dir)
    if (!fs.existsSync(full)) continue
    for (const file of fs.readdirSync(full).filter((f) => ext.test(f) && !f.startsWith('.')).sort()) {
      const existing = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1, depth: 0 })
      if (existing.docs[0]) {
        skipped++
        continue
      }
      const meta = captions.get(file) ?? {}
      await payload.create({
        collection: 'media',
        data: { alt: meta.alt || fromFileName(file), caption: meta.caption, folder: folder.id },
        filePath: path.join(full, file),
      })
      added++
      payload.logger.info(`Imported ${dir}/${file}`)
    }
  }
  payload.logger.info(`Gallery import done: ${added} added, ${skipped} already there`)
  process.exit(0)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
