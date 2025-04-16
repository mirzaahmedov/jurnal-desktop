import { useTranslation } from 'react-i18next'

import { JollySelect, SelectItem } from '@/common/components/jolly/select'

import flagRU from './flags/ru.svg'
import flagUZ from './flags/uz.svg'

export interface LanguageSelectProps {
  language: string
  onLanguageChange: (value: string) => void
}
export const LanguageSelect = ({ language, onLanguageChange }: LanguageSelectProps) => {
  const { t } = useTranslation(['app'])
  return (
    <>
      <JollySelect
        items={languageOptions}
        placeholder="Choose language"
        selectedKey={language}
        onSelectionChange={(value) => onLanguageChange(value as string)}
        className="w-48"
      >
        {(item) => (
          <SelectItem id={item.value}>
            <div className="flex items-center gap-2.5">
              <img
                src={item.icon}
                className="size-5 rounded border border-slate-300 box-content block"
              />
              {t(`locales.${item.name}`)}
            </div>
          </SelectItem>
        )}
      </JollySelect>
    </>
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
