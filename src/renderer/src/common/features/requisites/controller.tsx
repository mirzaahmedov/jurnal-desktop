import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { StepperSelector } from '@/common/components/stepper-selector'
import { Button } from '@/common/components/ui/button'
import { useToggle } from '@/common/hooks'

import { RequisitesDialog } from './dialog'
import { RequisitesInfoDialog } from './info-dialog'
import { useRequisitesStore } from './store'

export const RequisitesController = () => {
  const { budjet_id, main_schet_id, jur3_schet_id, jur4_schet_id, setRequisites } =
    useRequisitesStore()

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
      <div className="flex items-center gap-2 pl-2 pr-4 border-x">
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
          <p className="text-xs font-medium text-slate-500 ml-8">
            <Trans>main-schet</Trans>
          </p>

          {mainSchet ? (
            <div className="flex items-center gap-2">
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
                    jur3_schet_id: option.jur3_schets[0].id ?? undefined,
                    jur4_schet_id: option.jur4_schets[0].id ?? undefined
                  })
                }}
              />
              {location.pathname.startsWith('/kassa') ? (
                <span className="text-sm font-semibold text-center">{mainSchet.jur1_schet}</span>
              ) : location.pathname.startsWith('/bank') ? (
                <span className="text-sm font-semibold text-center">{mainSchet.jur2_schet}</span>
              ) : location.pathname.startsWith('/organization') ? (
                <StepperSelector
                  value={jur3_schet_id}
                  onValueChange={(jur3_schet_id) => {
                    setRequisites({ jur3_schet_id })
                  }}
                  options={mainSchet.jur3_schets ?? []}
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
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
      <RequisitesInfoDialog
        open={infoToggle.isOpen}
        onOpenChange={infoToggle.setOpen}
      />
    </>
  )
}
