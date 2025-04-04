import type { MainSchet } from '@/common/models'

import { RefreshCw } from 'lucide-react'
import { Trans } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { RequisitesDialog } from '@/common/features/requisites'
import { useToggle } from '@/common/hooks'

import { RequisitesInfoDialog } from './requisites-info-dialog'

export interface RequisitesProps {
  data?: MainSchet
  schet?: string
}
export const Requisites = ({ data, schet }: RequisitesProps) => {
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
        <p className="text-base font-semibold">
          {[data?.account_number, schet].filter((value) => !!value).join(' - ')}
        </p>
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
