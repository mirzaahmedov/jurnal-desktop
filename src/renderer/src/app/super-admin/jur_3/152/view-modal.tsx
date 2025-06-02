import type { AdminOrgan152 } from './interfaces'
import type { DialogTriggerProps } from 'react-aria-components'

import { GenericTable } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { AdminOrgan152MainSchetColumnDefs, AdminOrgan152SchetColumnDefs } from './columns'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminOrgan152 | null
}
export const ViewModal = ({ selected, ...props }: ViewModalProps) => {
  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-screen-2xl max-h-full flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
            <CollapsibleTable
              columnDefs={AdminOrgan152MainSchetColumnDefs}
              data={selected?.main_schets ?? []}
              getRowId={(row) => row.id.toString()}
            >
              {({ row }) => (
                <div className="pl-10">
                  <GenericTable
                    columnDefs={AdminOrgan152SchetColumnDefs}
                    data={row.jur3_schets_152 ?? []}
                  />
                </div>
              )}
            </CollapsibleTable>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
