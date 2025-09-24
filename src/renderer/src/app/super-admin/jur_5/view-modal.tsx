import type { AdminZarplataDashboard } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { AdminZarplataMainSchetColumnDefs } from './columns'
import { ViewDocumentsModal } from './view-documents-modal'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminZarplataDashboard | null
}
export const ViewModal = ({ selected, ...props }: ViewModalProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-screen-2xl max-h-full flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selected?.regionName}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
              <GenericTable
                columnDefs={AdminZarplataMainSchetColumnDefs}
                data={selected?.mainSchet ?? []}
                onClickRow={(row) => setSelectedId(row.mainSchetId)}
                getRowId={(row) => row.mainSchetId.toString()}
              />
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
      <ViewDocumentsModal
        isOpen={!!selectedId}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        selectedId={selectedId}
      />
    </>
  )
}
