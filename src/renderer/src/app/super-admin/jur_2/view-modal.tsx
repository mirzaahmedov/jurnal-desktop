import type { AdminBank, AdminBankDocument } from './interfaces'
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

import { AdminDocumentsType, ViewDocumentsModal } from '../components/view-documents-modal'
import { AdminBankMainSchetColumnDefs } from './columns'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminBank | null
  from: string
  to: string
}
export const ViewModal = ({ selected, from, to, ...props }: ViewModalProps) => {
  const [docs, setDocs] = useState<AdminBankDocument[]>()

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-screen-2xl max-h-full flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selected?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 max-h-[600px] overflow-y-auto scrollbar">
              <GenericTable
                columnDefs={AdminBankMainSchetColumnDefs}
                data={selected?.main_schets ?? []}
                params={{
                  from,
                  to,
                  regionId: selected?.id
                }}
                onDoubleClickRow={(row) => {
                  setDocs(row.docs)
                }}
              />
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
      <ViewDocumentsModal
        type={AdminDocumentsType.Bank}
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
