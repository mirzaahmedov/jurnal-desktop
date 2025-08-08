import type { AdminKassa } from './interfaces'
import type { DialogTriggerProps } from 'react-aria-components'

import { GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { AdminKassaMainSchetColumnDefs } from './columns'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminKassa | null
  from: string
  to: string
}
export const ViewModal = ({ selected, from, to, ...props }: ViewModalProps) => {
  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full max-h-full flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
            <GenericTable
              columnDefs={AdminKassaMainSchetColumnDefs}
              data={selected?.main_schets ?? []}
              params={{
                from,
                to,
                regionId: selected?.id
              }}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
