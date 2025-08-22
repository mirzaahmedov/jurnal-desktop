import { useQuery } from '@tanstack/react-query'
import { Calculator, Info } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

import { CalculateParamsService } from '@/app/jur_5/calculate-params/service'
import { DataList } from '@/common/components/data-list'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthNameCell } from '@/common/components/table/renderers/month-name'

import { useRequisitesStore } from '../requisites'
import { CalculateEmployeeSalaries } from './calculate-employee-salaries'
import { useZarplataStore } from './store'

export const ZarplataActions = () => {
  const calculateParamsId = useZarplataStore((store) => store.calculateParamsId)
  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)
  const { t } = useTranslation(['app'])

  const { data: calcParams } = useQuery({
    queryKey: [CalculateParamsService.QueryKeys.GetById, calculateParamsId],
    queryFn: CalculateParamsService.getCalcParametersById,
    enabled: !!calculateParamsId
  })

  return (
    <div className="flex flex-col gap-2.5">
      <DialogTrigger>
        <Button
          variant="outline"
          className="w-full"
        >
          <Info className="btn-icon icon-start" /> {t('pages.calc_parameters')}
        </Button>
        <DialogOverlay>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('pages.calc_parameters')}</DialogTitle>
            </DialogHeader>
            {calcParams ? (
              <DataList
                items={[
                  {
                    name: <Trans>year</Trans>,
                    value: calcParams.year
                  },
                  {
                    name: <Trans>month</Trans>,
                    value: <MonthNameCell monthNumber={calcParams.month} />
                  },
                  {
                    name: <Trans>min_salary</Trans>,
                    value: calcParams.minZar
                  },
                  {
                    name: <Trans>min_salary_year</Trans>,
                    value: calcParams.mZpGod
                  },
                  {
                    name: <Trans>min_salary_nontax</Trans>,
                    value: calcParams.neobMin
                  },
                  {
                    name: (
                      <>
                        <Trans>days</Trans> (5)
                      </>
                    ),
                    value: calcParams.dni5
                  },
                  {
                    name: (
                      <>
                        <Trans>hours</Trans> (5)
                      </>
                    ),
                    value: calcParams.chasi5
                  },
                  {
                    name: (
                      <>
                        <Trans>days</Trans> (6)
                      </>
                    ),
                    value: calcParams.dni6
                  },
                  {
                    name: (
                      <>
                        <Trans>hours</Trans> (6)
                      </>
                    ),
                    value: calcParams.chasi6
                  },
                  {
                    name: (
                      <>
                        <Trans>days</Trans> (7)
                      </>
                    ),
                    value: calcParams.dni7
                  },
                  {
                    name: (
                      <>
                        <Trans>hours</Trans> (7)
                      </>
                    ),
                    value: calcParams.chasi7
                  },
                  {
                    name: <Trans>for_ride</Trans>,
                    value: calcParams.zaProezd
                  },
                  {
                    name: <Trans>poek</Trans>,
                    value: calcParams.poek
                  }
                ]}
              />
            ) : null}
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
      <DialogTrigger>
        <Button
          className="w-full"
          isDisabled={!mainSchetId}
        >
          <Calculator className="btn-icon icon-start" /> {t('calculate_salary')}
        </Button>
        <DialogOverlay>
          <DialogContent className="w-full max-w-full h-full max-h-[800px]">
            <div className="flex flex-col gap-5">
              <DialogHeader>
                <DialogTitle>{t('calculate_salary')}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0">
                <CalculateEmployeeSalaries />
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </div>
  )
}
