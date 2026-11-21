import { describe, expect, it } from 'vitest'

import { getDict, localePath, stripLang } from '@/lib/i18n'
import { languageAlternates } from '@/lib/seo'

describe('languages', () => {
  it('builds and strips language prefixes', () => {
    expect(localePath('en', '/safaris')).toBe('/safaris')
    expect(localePath('no', '/safaris')).toBe('/no/safaris')
    expect(localePath('no', '/')).toBe('/no')
    expect(stripLang('/no/safaris/x')).toBe('/safaris/x')
    expect(stripLang('/no')).toBe('/')
    expect(stripLang('/nordic')).toBe('/nordic')
  })

  it('lists every language version of a page', () => {
    expect(languageAlternates('/safaris')).toEqual({ en: '/safaris', nb: '/no/safaris', 'x-default': '/safaris' })
  })

  it('has Norwegian for every interface text', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
      )
    expect(keys(getDict('no')).sort()).toEqual(keys(getDict('en')).sort())
    expect(getDict('no').nights(1)).toBe('1 natt')
    expect(getDict('no').nights(3)).toBe('3 netter')
  })
})
