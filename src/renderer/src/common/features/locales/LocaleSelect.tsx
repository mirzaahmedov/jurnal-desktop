import { useTranslation } from 'react-i18next'

import { SelectField } from '@/common/components'

import flagRU from './flags/ru.svg'
import flagUZ from './flags/uz.svg'

export interface LanguageSelectProps {
  value: string
  onValueChange: (value: string) => void
}
export const LanguageSelect = ({ value, onValueChange }: LanguageSelectProps) => {
  const { t } = useTranslation(['app'])
  return (
    <SelectField
      placeholder="Choose language"
      options={languageOptions}
      value={value}
      onValueChange={onValueChange}
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
const languageOptions = [
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
