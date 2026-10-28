import ExcelJS from 'exceljs'
import { Readable } from 'stream'

import { slugify } from './slug'

export const CATEGORIES = [
  'lodge',
  'park_fee',
  'vehicle',
  'guide',
  'transfer',
  'flight',
  'activity',
  'other',
] as const
export const SEASONS = ['low', 'high', 'peak', 'all'] as const
export const UNITS = [
  'per_person_per_night',
  'per_person_per_day',
  'per_vehicle_per_day',
  'per_person',
  'per_group',
] as const

export type Category = (typeof CATEGORIES)[number]
export type Season = (typeof SEASONS)[number]
export type Unit = (typeof UNITS)[number]

export type RateRow = {
  category: Category
  item: string
  destination: string | null
  tier: string | null
  season: Season
  unit: Unit
  adult: number
  child: number | null
  notes: string | null
}

export type ParseResult = { rows: RateRow[]; errors: string[] }

/** Header spellings we accept, so staff can upload their existing rate sheet with light edits. */
const HEADER_ALIASES: Record<keyof RateRow, string[]> = {
  category: ['category', 'type', 'kind'],
  item: ['item', 'name', 'lodge', 'service', 'description', 'code'],
  destination: ['destination', 'park', 'location', 'area'],
  tier: ['tier', 'level', 'class', 'category level'],
  season: ['season'],
  unit: ['unit', 'basis', 'per'],
  adult: ['adult', 'adult usd', 'adult_usd', 'price', 'rate', 'usd', 'adult rate'],
  child: ['child', 'child usd', 'child_usd', 'child rate'],
  notes: ['notes', 'note', 'comment', 'comments'],
}

const CATEGORY_ALIASES: Record<string, Category> = {
  lodge: 'lodge',
  camp: 'lodge',
  hotel: 'lodge',
  accommodation: 'lodge',
  park: 'park_fee',
  'park fee': 'park_fee',
  park_fee: 'park_fee',
  'park fees': 'park_fee',
  'conservation fee': 'park_fee',
  vehicle: 'vehicle',
  car: 'vehicle',
  'land cruiser': 'vehicle',
  guide: 'guide',
  transfer: 'transfer',
  flight: 'flight',
  activity: 'activity',
  excursion: 'activity',
  other: 'other',
}

const UNIT_ALIASES: Record<string, Unit> = {
  pppn: 'per_person_per_night',
  'per person per night': 'per_person_per_night',
  per_person_per_night: 'per_person_per_night',
  night: 'per_person_per_night',
  ppd: 'per_person_per_day',
  'per person per day': 'per_person_per_day',
  per_person_per_day: 'per_person_per_day',
  'per vehicle per day': 'per_vehicle_per_day',
  per_vehicle_per_day: 'per_vehicle_per_day',
  'vehicle day': 'per_vehicle_per_day',
  pp: 'per_person',
  'per person': 'per_person',
  per_person: 'per_person',
  'per group': 'per_group',
  per_group: 'per_group',
  group: 'per_group',
}

const DEFAULT_UNIT: Record<Category, Unit> = {
  lodge: 'per_person_per_night',
  park_fee: 'per_person_per_day',
  vehicle: 'per_vehicle_per_day',
  guide: 'per_vehicle_per_day',
  transfer: 'per_person',
  flight: 'per_person',
  activity: 'per_person',
  other: 'per_group',
}

const norm = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'number') return v
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''))
  return Number.isFinite(n) ? n : null
}

const cellValue = (v: ExcelJS.CellValue): unknown => {
  if (v && typeof v === 'object') {
    if ('result' in v) return v.result
    if ('text' in v) return v.text
    if ('richText' in v) return v.richText.map((t) => t.text).join('')
  }
  return v
}

/** Turns a 2D table (first row = headers) into validated rate rows. */
export function parseTable(table: unknown[][]): ParseResult {
  const errors: string[] = []
  const rows: RateRow[] = []
  const headerIndex = table.findIndex((r) => r.some((c) => norm(c) === 'category' || norm(c) === 'type'))
  if (headerIndex === -1) {
    return { rows, errors: ['Could not find a header row with a "category" column.'] }
  }
  const headers = table[headerIndex].map(norm)
  const col = {} as Record<keyof RateRow, number>
  for (const [key, aliases] of Object.entries(HEADER_ALIASES) as [keyof RateRow, string[]][]) {
    col[key] = headers.findIndex((h) => aliases.includes(h))
  }
  for (const required of ['category', 'item', 'adult'] as const) {
    if (col[required] === -1) errors.push(`Missing required column "${required}".`)
  }
  if (errors.length) return { rows, errors }

  const get = (r: unknown[], key: keyof RateRow) => (col[key] >= 0 ? r[col[key]] : undefined)

  table.slice(headerIndex + 1).forEach((r, i) => {
    const line = headerIndex + i + 2
    if (!r || r.every((c) => norm(c) === '')) return
    const category = CATEGORY_ALIASES[norm(get(r, 'category'))]
    if (!category) {
      errors.push(`Row ${line}: unknown category "${get(r, 'category')}".`)
      return
    }
    const item = String(get(r, 'item') ?? '').trim()
    const adult = toNumber(get(r, 'adult'))
    if (!item || adult === null) {
      errors.push(`Row ${line}: needs an item name and an adult price.`)
      return
    }
    const seasonRaw = norm(get(r, 'season')) || 'all'
    const season = (SEASONS as readonly string[]).includes(seasonRaw) ? (seasonRaw as Season) : null
    if (!season) {
      errors.push(`Row ${line}: season must be low, high, peak or all (got "${seasonRaw}").`)
      return
    }
    const unitRaw = norm(get(r, 'unit'))
    const unit = unitRaw ? UNIT_ALIASES[unitRaw] : DEFAULT_UNIT[category]
    if (!unit) {
      errors.push(`Row ${line}: unknown unit "${unitRaw}".`)
      return
    }
    const destination = String(get(r, 'destination') ?? '').trim()
    const tier = norm(get(r, 'tier'))
    const notes = String(get(r, 'notes') ?? '').trim()
    rows.push({
      category,
      item,
      destination: destination ? slugify(destination) : null,
      tier: tier || null,
      season,
      unit,
      adult,
      child: toNumber(get(r, 'child')),
      notes: notes || null,
    })
  })
  return { rows, errors }
}

export async function parsePriceFile(data: Buffer, filename: string): Promise<ParseResult> {
  const workbook = new ExcelJS.Workbook()
  const isCsv = /\.csv$/i.test(filename)
  if (isCsv) {
    await workbook.csv.read(Readable.from(data))
  } else {
    await workbook.xlsx.load(data as unknown as ArrayBuffer)
  }
  const all: ParseResult = { rows: [], errors: [] }
  let sheetsWithHeaders = 0
  workbook.eachSheet((sheet) => {
    const table: unknown[][] = []
    sheet.eachRow({ includeEmpty: true }, (row) => {
      const values = Array.isArray(row.values) ? row.values.slice(1) : []
      table.push(values.map((v) => cellValue(v as ExcelJS.CellValue)))
    })
    if (!table.length) return
    const result = parseTable(table)
    if (result.errors[0]?.startsWith('Could not find a header')) return
    sheetsWithHeaders++
    all.rows.push(...result.rows)
    all.errors.push(...result.errors.map((e) => (isCsv ? e : `${sheet.name}: ${e}`)))
  })
  if (!sheetsWithHeaders) all.errors.push('Could not find a header row with a "category" column.')
  return all
}
