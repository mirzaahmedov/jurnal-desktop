import type { MainZarplata } from '@/common/models'
import type { HTMLAttributes } from 'react'

import { useTranslation } from 'react-i18next'

import { LabeledValue } from '@/common/components/labeled-value'
import { Badge } from '@/common/components/ui/badge'
import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

export interface MainZarplataInfoProps extends HTMLAttributes<HTMLDivElement> {
  mainZarplata: MainZarplata
}

export const MainZarplataInfo = ({ mainZarplata, ...props }: MainZarplataInfoProps) => {
  const { t } = useTranslation()

  return (
    <div
      {...props}
      className={cn(
        'p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200',
        props.className
      )}
    >
      <div className="pb-3">
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold text-gray-800">{mainZarplata.fio}</span>
          <div className="flex items-center gap-2">
            {mainZarplata.xarbiy && <Badge variant="default">{t('military')}</Badge>}
            {mainZarplata.ostanovitRaschet && (
              <Badge
                variant="destructive"
                className="bg-red-100 text-red-800"
              >
                {t('calculation_stopped')}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <LabeledValue
            label={t('card_num')}
            value={mainZarplata.kartochka}
          />

          <LabeledValue
            label={t('rayon')}
            value={mainZarplata.rayon}
          />

          <LabeledValue
            label={t('doljnost')}
            value={mainZarplata.doljnostName}
          />

          <LabeledValue
            label={t('military_rank')}
            value={mainZarplata.spravochikZarplataZvanieName}
          />

          <LabeledValue
            label={t('inn')}
            value={mainZarplata.inn}
          />

          <LabeledValue
            label={t('inps')}
            value={mainZarplata.inps}
          />

          {mainZarplata.stavka && (
            <LabeledValue
              label={t('stavka')}
              value={formatNumber(mainZarplata.stavka)}
            />
          )}

          {mainZarplata.doljnostOklad && (
            <LabeledValue
              label={t('oklad')}
              value={formatNumber(mainZarplata.doljnostOklad)}
            />
          )}
        </div>

        {(mainZarplata.raschetSchet || mainZarplata.bank) && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainZarplata.raschetSchet && (
                <LabeledValue
                  label={t('raschet-schet')}
                  value={mainZarplata.raschetSchet}
                />
              )}

              {mainZarplata.bank && (
                <LabeledValue
                  label={t('bank')}
                  value={mainZarplata.bank}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
