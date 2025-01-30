import { SelectField } from '@renderer/common/components'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import flagUZ from './flags/uz.svg'
import flagRU from './flags/ru.svg'

export const LocaleSelect = () => {
  const { t, i18n } = useTranslation('app')
  const [value, setValue] = useState(i18n.language)

  useEffect(() => {
    i18n.on('languageChanged', setValue)

    return () => {
      i18n.off('languageChanged', setValue)
    }
  }, [i18n])

  return (
    <SelectField
      placeholder="Choose language"
      options={localeOptions}
      value={value}
      onValueChange={(locale) => {
        setValue(value)
        i18n.changeLanguage(locale)
      }}
      getOptionLabel={(option) => (
        <div className="flex items-center gap-2.5">
          <img
            src={option.icon}
            className="size-5 rounded border border-slate-300 box-content block"
          />
          {t(`locales.${option.name}`)}
        </div>
      )}
      getOptionValue={(option) => option.value}
    />
  )
}
const localeOptions = [
  {
    value: 'uz',
    name: 'uz',
    icon: flagUZ
  },
  {
    value: 'ru',
    name: 'ru',
    icon: flagRU
  }
] as const
