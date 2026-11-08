/**
 * Swaps the file of an existing Media item, so every page that uses it shows the new picture.
 *   REPLACE=old-file-name WITH=path/to/new.jpg ALT="..." npm run replace-media
 * REPLACE matches the start of the stored file name (so "hiker-looking-at-kilimanjaro" also finds
 * "hiker-looking-at-kilimanjaro-1.jpg"). ALT and CAPTION are optional.
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

async function run() {
  const { REPLACE: old, WITH: file, ALT: alt, CAPTION: caption } = process.env
  if (!old || !file) throw new Error('Set REPLACE (old file name) and WITH (path to the new file)')
  const filePath = path.resolve(file)
  if (!fs.existsSync(filePath)) throw new Error(`No file at ${filePath}`)
  const payload = await getPayload({ config })

  const stem = old.replace(/\.[^.]+$/, '')
  const found = await payload.find({ collection: 'media', where: { filename: { like: `${stem}%` } }, limit: 20, depth: 0 })
  if (!found.docs.length) throw new Error(`No media file starting with "${stem}"`)

  for (const doc of found.docs) {
    await payload.update({
      collection: 'media',
      id: doc.id,
      filePath,
      data: { ...(alt ? { alt } : {}), ...(caption !== undefined ? { caption } : {}) },
    })
    payload.logger.info(`Replaced ${doc.filename} with ${path.basename(filePath)}`)
  }
  process.exit(0)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
