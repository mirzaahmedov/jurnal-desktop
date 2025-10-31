import { AppWindow } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

import { Button } from '@/common/components/jolly/button'
import { YearSelect } from '@/common/components/year-select'
import { useLocationState } from '@/common/hooks'

export const useYearFilter = () => {
  return useLocationState<number | undefined>('year', new Date().getFullYear())
}
export const useDialogState = create<{
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}>((set) => ({
  isOpen: false,
  setOpen: (isOpen: boolean) => set({ isOpen })
}))

export const TwoFFilters = () => {
  const [year, setYear] = useYearFilter()

  const { t } = useTranslation()
  const { setOpen } = useDialogState()

  return (
    <div className="flex items-center justify-between gap-5">
      <YearSelect
        selectedKey={year}
        onSelectionChange={(value) => setYear(value ? Number(value) : undefined)}
        className="w-24"
      />
      <Button
        IconStart={AppWindow}
        variant="outline"
        onClick={() => {
          setOpen(true)
        }}
      >
        {t('saldo')}
      </Button>
    </div>
  )
}
