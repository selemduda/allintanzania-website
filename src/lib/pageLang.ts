import { notFound } from 'next/navigation'

import { isLang, type Lang } from './i18n'

/** Reads the [lang] route segment; anything other than a supported language is a 404. */
export async function pageLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return lang
}
