import type { AdminMaterial } from './interfaces'

import { type DialogTriggerProps } from 'react-aria-components'

import { GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { AdminMaterialMainSchetColumnDefs } from './columns'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminMaterial | null
  from: string
  to: string
}
export const ViewModal = ({ selected, from, to, ...props }: ViewModalProps) => {
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
