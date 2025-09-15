import { useState } from 'react'

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
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'

import { useRequisitesStore } from '../requisites'
import { CalculateEmployeeSalaries } from './calculate-employee-salaries'
import { CalculateOklad } from './calculate-oklad'
import { useZarplataStore } from './store'

enum TabOption {
  Nachislenie = 'nachislenie',
  Oklad = 'oklad'
}

export const ZarplataActions = () => {
  const calculateParamsId = useZarplataStore((store) => store.calculateParamsId)
  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)

  const [tabValue, setTabValue] = useState(TabOption.Nachislenie)

  const { t } = useTranslation(['app'])

  const calculateParamsQuery = useQuery({
    queryKey: [CalculateParamsService.QueryKeys.GetById, calculateParamsId],
    queryFn: CalculateParamsService.getCalcParametersById,
    enabled: !!calculateParamsId
  })
  const calculateParams = calculateParamsQuery.data

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
            {calculateParams ? (
              <DataList
                items={[
                  {
                    name: <Trans>year</Trans>,
                    value: calculateParams.year
                  },
                  {
                    name: <Trans>month</Trans>,
                    value: <MonthNameCell monthNumber={calculateParams.month} />
                  },
                  {
                    name: <Trans>min_salary</Trans>,
                    value: calculateParams.minZar
                  },
                  {
                    name: <Trans>min_salary_year</Trans>,
                    value: calculateParams.mZpGod
                  },
                  {
                    name: <Trans>min_salary_nontax</Trans>,
                    value: calculateParams.neobMin
                  },
                  {
                    name: (
                      <>
                        <Trans>days</Trans> (5)
                      </>
                    ),
                    value: calculateParams.dni5
                  },
                  {
                    name: (
                      <>
                        <Trans>hours</Trans> (5)
                      </>
                    ),
                    value: calculateParams.chasi5
                  },
                  {
                    name: (
                      <>
                        <Trans>days</Trans> (6)
                      </>
                    ),
                    value: calculateParams.dni6
                  },
                  {
                    name: (
                      <>
                        <Trans>hours</Trans> (6)
                      </>
                    ),
                    value: calculateParams.chasi6
                  },
                  {
                    name: (
                      <>
                        <Trans>days</Trans> (7)
                      </>
                    ),
                    value: calculateParams.dni7
                  },
                  {
                    name: (
                      <>
                        <Trans>hours</Trans> (7)
                      </>
                    ),
                    value: calculateParams.chasi7
                  },
                  {
                    name: <Trans>for_ride</Trans>,
                    value: calculateParams.zaProezd
                  },
                  {
                    name: <Trans>poek</Trans>,
                    value: calculateParams.poek
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
            <div className="flex flex-col gap-5 overflow-hidden">
              <DialogHeader>
                <DialogTitle>{t('calculate_salary')}</DialogTitle>
                <Tabs
                  value={tabValue}
                  onValueChange={(value) => setTabValue(value as TabOption)}
                >
                  <TabsList>
                    <TabsTrigger value={TabOption.Nachislenie}>{t('nachislenie')}</TabsTrigger>
                    <TabsTrigger value={TabOption.Oklad}>{t('oklad')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </DialogHeader>
              <div className="w-full flex-1 min-h-0 overflow-hidden">
                {tabValue === TabOption.Nachislenie ? (
                  <CalculateEmployeeSalaries />
                ) : (
                  <CalculateOklad />
                )}
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </div>
  )
}
