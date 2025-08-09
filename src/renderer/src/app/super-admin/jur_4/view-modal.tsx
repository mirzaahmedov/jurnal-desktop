import type { AdminPodotchet, AdminPodotchetDocument } from './interfaces'
import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { GenericTable } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { AdminDocumentsType, ViewDocumentsModal } from '../components/view-documents-modal'
import { AdminPodotchetMainSchetColumnDefs, AdminPodotchetSchetColumnDefs } from './columns'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminPodotchet | null
  from: string
  to: string
}
export const ViewModal = ({ selected, from, to, ...props }: ViewModalProps) => {
  const [docs, setDocs] = useState<AdminPodotchetDocument[]>()

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-screen-2xl max-h-full flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selected?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
              <CollapsibleTable
                columnDefs={AdminPodotchetMainSchetColumnDefs}
                data={selected?.main_schets ?? []}
                getRowId={(row) => row.id.toString()}
              >
                {({ row }) => (
                  <div className="pl-10">
                    <GenericTable
                      columnDefs={AdminPodotchetSchetColumnDefs}
                      data={row.jur4_schets ?? []}
                      params={{
                        from,
                        to,
                        regionId: selected?.id,
                        mainSchetId: row.id,
                        budjetId: row.budjet_id
                      }}
                      onDoubleClickRow={(row) => {
                        setDocs(row.docs)
                      }}
                    />
                  </div>
                )}
              </CollapsibleTable>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
      <ViewDocumentsModal
        type={AdminDocumentsType.Podotchet}
        isOpen={!!docs}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDocs(undefined)
          }
        }}
        docs={docs ?? []}
      />
    </>
  )
}
