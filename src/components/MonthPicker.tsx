'use client'

import React, { useEffect, useRef, useState } from 'react'

import { getDict, type Lang } from '@/lib/i18n'

type Props = {
  id: string
  name: string
  lang: Lang
}

const LOCALE: Record<Lang, string> = { en: 'en-GB', no: 'nb-NO' }
const YEARS_AHEAD = 3

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Month and year only: a small calendar of months, submitted as text such as "July 2027". */
export function MonthPicker({ id, name, lang }: Props) {
  const t = getDict(lang).form
  const now = new Date()
  const firstYear = now.getFullYear()
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(firstYear)
  const [value, setValue] = useState<{ month: number; year: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const months = Array.from({ length: 12 }, (_, m) =>
    capitalise(new Intl.DateTimeFormat(LOCALE[lang], { month: 'short' }).format(new Date(2000, m, 1)).replace('.', '')),
  )
  const label = (m: number, y: number) =>
    capitalise(new Intl.DateTimeFormat(LOCALE[lang], { month: 'long', year: 'numeric' }).format(new Date(y, m, 1)))

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="month-picker" ref={ref}>
      <button
        type="button"
        id={id}
        className={`month-picker-toggle${value ? '' : ' empty'}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {value ? label(value.month, value.year) : t.whenPlaceholder}
      </button>
      <input type="hidden" name={name} value={value ? label(value.month, value.year) : ''} />
      {open && (
        <div className="month-picker-panel" role="dialog" aria-label={t.when}>
          <div className="month-picker-head">
            <button
              type="button"
              aria-label={t.prevYear}
              disabled={year <= firstYear}
              onClick={() => setYear((y) => y - 1)}
            >
              ‹
            </button>
            <strong>{year}</strong>
            <button
              type="button"
              aria-label={t.nextYear}
              disabled={year >= firstYear + YEARS_AHEAD}
              onClick={() => setYear((y) => y + 1)}
            >
              ›
            </button>
          </div>
          <div className="month-picker-grid">
            {months.map((m, i) => {
              const past = year === firstYear && i < now.getMonth()
              const on = value?.month === i && value.year === year
              return (
                <button
                  key={m}
                  type="button"
                  disabled={past}
                  aria-pressed={on}
                  aria-label={label(i, year)}
                  className={on ? 'on' : undefined}
                  onClick={() => {
                    setValue({ month: i, year })
                    setOpen(false)
                  }}
                >
                  {m}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
