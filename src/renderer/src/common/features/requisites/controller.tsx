import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { StepperSelector } from '@/common/components/stepper-selector'
import { Button } from '@/common/components/ui/button'
import { useToggle } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { RequisitesDialog } from './dialog'
import { RequisitesInfoDialog } from './info-dialog'
import { useRequisitesStore } from './store'

export const RequisitesController = () => {
  const {
    budjet_id,
    main_schet_id,
    jur3_schet_152_id,
    jur3_schet_159_id,
    jur4_schet_id,
    setRequisites
  } = useRequisitesStore()

  const location = useLocation()
  const dialogToggle = useToggle()
  const infoToggle = useToggle()

  const { data: mainSchets } = useQuery({
    queryKey: [
      MainSchetQueryKeys.getAll,
      {
        budjet_id
      }
    ],
    queryFn: MainSchetService.getAll,
    enabled: !!budjet_id
  })

  const mainSchet = useMemo(() => {
    return mainSchets?.data?.find((item) => item.id === main_schet_id)
  }, [mainSchets, main_schet_id])

  return (
    <>
      <div className="flex items-center gap-0 mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={dialogToggle.open}
        >
          <RefreshCw />
        </Button>
        <div
          className="flex flex-col gap-0.5 cursor-pointer"
          onClick={infoToggle.open}
        >
          <p className={cn('text-xs font-medium text-slate-500', mainSchet && 'ml-8')}>
            <Trans>main-schet</Trans>
          </p>

          {mainSchet ? (
            <div className="flex items-center gap-0">
              <StepperSelector
                value={main_schet_id}
                onValueChange={(main_schet_id) => {
                  setRequisites({ main_schet_id })
                }}
                options={mainSchets?.data ?? []}
                getOptionValue={(option) => option.id}
                getOptionLabel={(option) => option.account_number}
                onOptionSelect={(option) => {
                  setRequisites({
                    jur3_schet_152_id: option.jur3_schets_152[0].id ?? undefined,
                    jur3_schet_159_id: option.jur3_schets_159[0].id ?? undefined,
                    jur4_schet_id: option.jur4_schets[0].id ?? undefined
                  })
                }}
              />
              {location.pathname.startsWith('/kassa') ? (
                <span className="text-sm font-semibold text-center">{mainSchet.jur1_schet}</span>
              ) : location.pathname.startsWith('/bank') ? (
                <span className="text-sm font-semibold text-center">{mainSchet.jur2_schet}</span>
              ) : location.pathname.startsWith('/organization/152') ? (
                <StepperSelector
                  value={jur3_schet_152_id}
                  onValueChange={(jur3_schet_152_id) => {
                    setRequisites({ jur3_schet_152_id })
                  }}
                  options={mainSchet.jur3_schets_152 ?? []}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.schet}
                />
              ) : location.pathname.startsWith('/organization/159') ? (
                <StepperSelector
                  value={jur3_schet_159_id}
                  onValueChange={(jur3_schet_159_id) => {
                    setRequisites({ jur3_schet_159_id })
                  }}
                  options={mainSchet.jur3_schets_159 ?? []}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.schet}
                />
              ) : location.pathname.startsWith('/accountable') ? (
                <StepperSelector
                  value={jur4_schet_id}
                  onValueChange={(jur4_schet_id) => {
                    setRequisites({ jur4_schet_id })
                  }}
                  options={mainSchet.jur4_schets ?? []}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.schet}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <RequisitesDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
      <RequisitesInfoDialog
        isOpen={infoToggle.isOpen}
        onOpenChange={infoToggle.setOpen}
      />
    </>
  )
}
