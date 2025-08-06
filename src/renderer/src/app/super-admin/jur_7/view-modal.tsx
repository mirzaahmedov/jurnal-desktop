import type { AdminMaterial } from './interfaces'

import { useMemo } from 'react'

import { Download } from 'lucide-react'
import { type DialogTriggerProps } from 'react-aria-components'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useToggle } from '@/common/hooks'
import { formatDate, getFirstDayOfMonth, parseDate } from '@/common/lib/date'

import { AdminMaterialMainSchetColumnDefs } from './columns'
import { MaterialReportModal } from './material-report-modal'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminMaterial | null
  to: string
}
export const ViewModal = ({ selected, to, ...props }: ViewModalProps) => {
  const { from, year, month } = useMemo(() => {
    const date = parseDate(to)
    return {
      from: formatDate(getFirstDayOfMonth(date)),
      year: date.getFullYear(),
      month: date.getMonth() + 1
    }
  }, [to])
  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-screen-2xl max-h-full flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
            <GenericTable
              data={selected?.main_schets ?? []}
              columnDefs={AdminMaterialMainSchetColumnDefs}
              actions={(row) =>
                selected?.id ? (
                  <DownloadMaterialCell
                    budjet_id={row.budjet_id}
                    main_schet_id={row.id}
                    region_id={selected?.id ?? 0}
                    from={from}
                    to={to}
                    year={year}
                    month={month}
                  />
                ) : null
              }
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

interface DownloadMaterialCellProps {
  budjet_id: number
  main_schet_id: number
  region_id: number
  from: string
  to: string
  year: number
  month: number
}
const DownloadMaterialCell = ({
  budjet_id,
  main_schet_id,
  region_id,
  from,
  to,
  year,
  month
}: DownloadMaterialCellProps) => {
  const modalToggle = useToggle()

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        onPress={modalToggle.open}
      >
        <Download className="btn-icon" />
      </Button>
      <MaterialReportModal
        isOpen={modalToggle.isOpen}
        onOpenChange={modalToggle.setOpen}
        region_id={region_id}
        budjet_id={budjet_id}
        main_schet_id={main_schet_id}
        from={from}
        to={to}
        year={year}
        month={month}
      />
    </>
  )
}
