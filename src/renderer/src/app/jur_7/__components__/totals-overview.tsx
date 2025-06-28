import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { Label } from '@/common/components/ui/label'

export interface TotalsOverviewProps {
  total: number
  _01: number
  _06: number
  _07: number
  iznos: number
}
export const TotalsOverview = ({ total, _01, _06, _07, iznos }: TotalsOverviewProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between flex-wrap bg-gray-50 border border-gray-200 p-10 rounded-lg">
      <div className="flex items-center gap-5">
        <Label className="font-bold text-sm text-gray-500">{t('total')}</Label>
        <NumericInput
          readOnly
          value={total}
          className="w-32"
        />
      </div>

      <div className="flex items-center flex-wrap gap-10">
        <div className="flex items-center gap-5">
          <Label className="font-bold text-sm text-gray-500">01</Label>
          <NumericInput
            readOnly
            value={_01}
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-5">
          <Label className="font-bold text-sm text-gray-500">06</Label>
          <NumericInput
            readOnly
            value={_06}
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-5">
          <Label className="font-bold text-sm text-gray-500">07</Label>
          <NumericInput
            readOnly
            value={_07}
            className="w-32"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Label className="font-bold text-sm text-gray-500">{t('iznos')}</Label>
        <NumericInput
          readOnly
          value={iznos}
          className="w-32"
        />
      </div>
    </div>
  )
}
