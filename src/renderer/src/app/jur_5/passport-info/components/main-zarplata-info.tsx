import type { HTMLAttributes } from 'react'

import { useQuery } from '@tanstack/react-query'
import { BookUser } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Spinner } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { LabeledValue } from '@/common/components/labeled-value'
import { Badge } from '@/common/components/ui/badge'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PassportInfoTabs, useZarplataStore } from '@/common/features/zarplata/store'
import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

export interface MainZarplataInfoProps extends HTMLAttributes<HTMLDivElement> {
  mainZarplataId: number
}

export const MainZarplataInfo = ({ mainZarplataId, ...props }: MainZarplataInfoProps) => {
  const { t } = useTranslation()
  const { openMainZarplataView, setCurrentTab } = useZarplataStore()

  const mainZarplataQuery = useQuery({
    queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplataId],
    queryFn: MainZarplataService.getById
  })
  const mainZarplata = mainZarplataQuery.data?.data

  return mainZarplataQuery.isLoading ? (
    <div className="py-10 grid place-items-center">
      <Spinner />
    </div>
  ) : (
    <div
      {...props}
      className={cn(
        'p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200',
        props.className
      )}
    >
      <div className="pb-3">
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold text-gray-800">{mainZarplata?.fio}</span>
          <div className="flex items-center gap-2">
            {mainZarplata?.xarbiy && <Badge variant="default">{t('military')}</Badge>}
            {mainZarplata?.ostanovitRaschet && (
              <Badge
                variant="destructive"
                className="bg-rose-100 text-rose-600 shadow-none hover:bg-rose-100"
              >
                {t('calculation_stopped')}
              </Badge>
            )}
          </div>

          <Button
            onClick={() => {
              openMainZarplataView(mainZarplataId)
              setCurrentTab(PassportInfoTabs.Main)
            }}
            variant="outline"
            size="icon"
          >
            <BookUser className="btn-icon" />
          </Button>
        </div>
      </div>

      <div className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <LabeledValue
            label={t('card_num')}
            value={mainZarplata?.kartochka}
          />

          <LabeledValue
            label={t('rayon')}
            value={mainZarplata?.rayon}
          />

          <LabeledValue
            label={t('doljnost')}
            value={mainZarplata?.doljnostName}
          />

          <LabeledValue
            label={t('military_rank')}
            value={mainZarplata?.spravochikZarplataZvanieName}
          />

          <LabeledValue
            label={t('inn')}
            value={mainZarplata?.inn}
          />

          <LabeledValue
            label={t('inps')}
            value={mainZarplata?.inps}
          />

          {mainZarplata?.stavka && (
            <LabeledValue
              label={t('stavka')}
              value={formatNumber(mainZarplata.stavka)}
            />
          )}

          {mainZarplata?.doljnostOklad && (
            <LabeledValue
              label={t('oklad')}
              value={formatNumber(mainZarplata.doljnostOklad)}
            />
          )}
        </div>

        {(mainZarplata?.raschetSchet || mainZarplata?.bank) && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainZarplata?.raschetSchet && (
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
