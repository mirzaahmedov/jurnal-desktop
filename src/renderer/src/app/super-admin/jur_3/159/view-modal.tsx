import type { AdminOrgan159, AdminOrgan159Document } from './interfaces'
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

import { AdminDocumentsType, ViewDocumentsModal } from '../../components/view-documents-modal'
import { AdminOrgan159MainSchetColumnDefs, AdminOrgan159SchetColumnDefs } from './columns'
import { AdminOrgan159Reports } from './reports'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminOrgan159 | null
  from: string
  to: string
}
export const ViewModal = ({ selected, from, to, ...props }: ViewModalProps) => {
  const [docs, setDocs] = useState<AdminOrgan159Document[]>()

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
                columnDefs={AdminOrgan159MainSchetColumnDefs}
                data={selected?.main_schets ?? []}
                getRowId={(row) => row.id.toString()}
                onView={(row) => setDocs(row.docs)}
              >
                {({ row }) => (
                  <div className="pl-10">
                    <GenericTable
                      columnDefs={AdminOrgan159SchetColumnDefs}
                      data={row.jur3_schets_159 ?? []}
                      params={{
                        from,
                        to,
                        regionId: selected?.id,
                        mainSchetId: row.id,
                        budjetId: row.budjet_id
                      }}
                      onView={(row) => setDocs(row.docs)}
                      actions={(row, tableProps) => (
                        <AdminOrgan159Reports
                          row={row}
                          tableProps={tableProps}
                        />
                      )}
                    />
                  </div>
                )}
              </CollapsibleTable>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <ViewDocumentsModal
        type={AdminDocumentsType.Organ159}
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
