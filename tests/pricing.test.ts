import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'

import { parsePriceFile, parseTable } from '@/lib/priceList'
import { estimateTrip, publicEstimate } from '@/lib/pricing'
import type { PricingSetting } from '@/payload-types'

const settings = {
  seasons: { jan: 'high', feb: 'high', mar: 'high', apr: 'low', may: 'low', jun: 'high', jul: 'peak', aug: 'peak', sep: 'peak', oct: 'high', nov: 'low', dec: 'peak' },
  markupPercent: 20,
  vehicleCapacity: 6,
  rangePercent: 10,
  fallbackLodgeRates: { comfort: 180, classic: 380, luxury: 950 },
} as unknown as PricingSetting

const destinations = new Map([
  ['serengeti', { slug: 'serengeti', name: 'Serengeti', type: 'park' as const }],
  ['zanzibar', { slug: 'zanzibar', name: 'Zanzibar', type: 'beach' as const }],
])

describe('price list parser', () => {
  it('reads the CSV template', async () => {
    const { rows, errors } = await parsePriceFile(readFileSync('public/price-list-template.csv'), 'template.csv')
    expect(errors).toEqual([])
    expect(rows.length).toBe(49)
    expect(rows.find((r) => r.item === 'Serengeti park fee')).toMatchObject({
      category: 'park_fee',
      destination: 'serengeti',
      unit: 'per_person_per_day',
      adult: 82.6,
    })
  })

  it('accepts friendly headers and reports bad rows', () => {
    const { rows, errors } = parseTable([
      ['Type', 'Name', 'Park', 'Level', 'Season', 'Per', 'Price', 'Child'],
      ['Camp', 'Test Camp', 'Lake Manyara', 'classic', 'High', 'pppn', '$300', ''],
      ['Spaceship', 'Nope', '', '', '', '', '10', ''],
    ])
    expect(rows[0]).toMatchObject({ category: 'lodge', destination: 'lake-manyara', season: 'high', adult: 300, child: null })
    expect(errors).toEqual(['Row 3: unknown category "Spaceship".'])
  })
})

describe('estimateTrip', () => {
  const rates = parseTable([
    ['category', 'item', 'destination', 'tier', 'season', 'unit', 'adult', 'child'],
    ['lodge', 'Camp A', 'serengeti', 'classic', 'peak', 'per_person_per_night', '500', '250'],
    ['lodge', 'Camp A', 'serengeti', 'classic', 'low', 'per_person_per_night', '300', '150'],
    ['park_fee', 'Serengeti fee', 'serengeti', '', 'all', 'per_person_per_day', '80', '20'],
    ['vehicle', 'Land Cruiser', '', '', 'all', 'per_vehicle_per_day', '250', ''],
  ]).rows

  it('prices a peak-season Serengeti and beach trip', () => {
    const e = estimateTrip(
      { stops: [{ destination: 'serengeti', nights: 3 }, { destination: 'zanzibar', nights: 2 }], month: 8, adults: 2, children: 1, tier: 'classic' },
      { rates, settings, destinations },
    )
    // lodge 3 * (2*500 + 250) = 3750; fees 3 * (2*80 + 20) = 540; vehicle 250 * 1 * 4 = 1000;
    // Zanzibar fallback 2 * (380*2 + 190) = 1900 -> subtotal 7190, +20% = 8628
    expect(e.season).toBe('peak')
    expect(e.subtotal).toBe(7190)
    expect(e.total).toBe(8630)
    expect(e.usedFallback).toBe(true)
    expect(e.lines.reduce((s, l) => s + l.amount, 0)).toBeCloseTo(8628, -1)
    expect(publicEstimate(e)).not.toHaveProperty('markup')
  })

  it('uses the low season rate in April', () => {
    const e = estimateTrip(
      { stops: [{ destination: 'serengeti', nights: 1 }], month: 4, adults: 1, tier: 'classic' },
      { rates, settings, destinations },
    )
    expect(e.lines[0].amount).toBeCloseTo(300 * 1.2, 0)
  })
})
