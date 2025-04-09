import type { MainSchet } from '@/common/models'
import type { ReactNode } from 'react'

import { RefreshCw } from 'lucide-react'
import { Trans } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { RequisitesDialog, useRequisitesStore } from '@/common/features/requisites'
import { useToggle } from '@/common/hooks'

import { RequisitesInfoDialog } from './requisites-info-dialog'
import { SchetSelector } from './schet-selector'

export interface RequisitesProps {
  data?: MainSchet
  pathname: string
}
export const Requisites = ({ data, pathname }: RequisitesProps) => {
  const dialogToggle = useToggle()
  const infoToggle = useToggle()

  return (
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
        onClick={data ? infoToggle.open : undefined}
      >
        <p className="text-xs font-medium text-slate-500">
          <Trans>main-schet</Trans>
        </p>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">{data?.account_number}</span>
          <CurrentSchet
            mainSchet={data}
            pathname={pathname}
          />
        </div>
      </div>

      {data ? (
        <RequisitesInfoDialog
          open={infoToggle.isOpen}
          onOpenChange={infoToggle.setOpen}
          data={data}
        />
      ) : null}
      <RequisitesDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </div>
  )
}

type CurrentSchetProps = {
  mainSchet?: MainSchet
  pathname: string
}
const CurrentSchet = ({ mainSchet, pathname }: CurrentSchetProps): ReactNode => {
  const { jur3_schet_id, jur4_schet_id, setRequisites } = useRequisitesStore()

  switch (true) {
    case !mainSchet:
      return ''
    case pathname.startsWith('/kassa'):
      return <span className="text-sm font-semibold">{mainSchet.jur1_schet}</span>
    case pathname.startsWith('/bank'):
      return <span className="text-sm font-semibold">{mainSchet.jur2_schet}</span>
    case pathname.startsWith('/organization'):
      return (
        <SchetSelector
          value={jur3_schet_id!}
          onValueChange={(value) => {
            setRequisites({ jur3_schet_id: value })
          }}
          schetOptions={mainSchet?.jur3_schets ?? []}
        />
      )
    case pathname.startsWith('/accountable'):
      return (
        <SchetSelector
          value={jur4_schet_id!}
          onValueChange={(value) => {
            setRequisites({ jur4_schet_id: value })
          }}
          schetOptions={mainSchet?.jur4_schets ?? []}
        />
      )
    default:
      return ''
  }
}
