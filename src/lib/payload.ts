import config from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import { mediaPath } from './format'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

/** Public-safe view of the AI expert: never send the personality or facts to the browser. */
export const getPublicExpert = cache(async () => {
  const payload = await getPayloadClient()
  const expert = await payload.findGlobal({ slug: 'expert-settings', depth: 1, overrideAccess: true })
  return {
    enabled: expert.enabled !== false,
    name: expert.expertName || 'Baraka',
    title: expert.expertTitle || 'Safari Expert',
    greeting: expert.greeting || 'Karibu! How can I help you plan your safari?',
    avatar: expert.avatar && typeof expert.avatar === 'object' ? mediaPath(expert.avatar.url) : null,
    voiceProvider: expert.voice?.provider || 'browser',
  }
})

export type PublicExpert = Awaited<ReturnType<typeof getPublicExpert>>

export async function findBySlug<T extends 'destinations' | 'lodges' | 'itineraries' | 'posts'>(
  collection: T,
  slug: string,
  depth = 2,
) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth,
    limit: 1,
  })
  return docs[0] ?? null
}
