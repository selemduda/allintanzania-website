'use client'

import React, { useMemo } from 'react'

import { getDict, type Lang } from '@/lib/i18n'

type Props = {
  id: string
  name: string
  lang: Lang
}

const LOCALE: Record<Lang, string> = { en: 'en-GB', no: 'nb-NO' }

// Where most of our guests come from, shown above the full list.
const COMMON = ['NO', 'TZ', 'SE', 'DK', 'FI', 'GB', 'DE', 'NL', 'US']

const ALL =
  'AF AX AL DZ AS AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR BN BG BF BI CV KH CM CA KY CF TD CL CN CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RE RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VA VE VN VG VI YE ZM ZW'.split(
    ' ',
  )

/** Country dropdown in the visitor's language; the English name is what gets submitted. */
export function CountrySelect({ id, name, lang }: Props) {
  const t = getDict(lang).form
  type Option = { code: string; label: string; value: string }
  const { common, rest } = useMemo(() => {
    const local = new Intl.DisplayNames([LOCALE[lang]], { type: 'region' })
    const english = new Intl.DisplayNames(['en'], { type: 'region' })
    const option = (code: string): Option => ({ code, label: local.of(code) ?? code, value: english.of(code) ?? code })
    return {
      common: COMMON.map(option),
      rest: ALL.filter((c) => !COMMON.includes(c))
        .map(option)
        .sort((a, b) => a.label.localeCompare(b.label, LOCALE[lang])),
    }
  }, [lang])

  // Server and browser Intl data can spell a few names differently, hence suppressHydrationWarning.
  return (
    <select id={id} name={name} defaultValue="" autoComplete="country-name">
      <option value="" disabled>
        {t.countryPlaceholder}
      </option>
      <optgroup label={t.countryCommon}>
        {common.map((c) => (
          <option key={c.code} value={c.value} suppressHydrationWarning>
            {c.label}
          </option>
        ))}
      </optgroup>
      <optgroup label={t.countryAll}>
        {rest.map((c) => (
          <option key={c.code} value={c.value} suppressHydrationWarning>
            {c.label}
          </option>
        ))}
      </optgroup>
    </select>
  )
}
