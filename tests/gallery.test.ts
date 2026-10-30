import { describe, expect, it } from 'vitest'

import { readCaptions } from '../src/lib/galleryCaptions'

describe('gallery captions', () => {
  it('reads quoted fields and finds columns by name', () => {
    const csv = '﻿filename,alt_text,caption\nphotos/lion.jpg,"A lion, resting",Serengeti\r\n"zebra.jpg","Zebra ""stripes""",\n'
    const map = readCaptions(csv)
    expect(map.get('lion.jpg')).toEqual({ alt: 'A lion, resting', caption: 'Serengeti' })
    expect(map.get('zebra.jpg')).toEqual({ alt: 'Zebra "stripes"', caption: undefined })
  })
})
