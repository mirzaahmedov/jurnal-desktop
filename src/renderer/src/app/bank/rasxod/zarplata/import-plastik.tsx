import type { Nachislenie, UderjaniePlastik } from '@/common/models'
import type { Vacant } from '@renderer/common/models/vacant'

import { useState } from 'react'

import { type RelationTreeNode } from '@/common/lib/tree/relation-tree'

import { NachislenieTable } from './nachislenie-table'
import { UderjanieDialog, UderjanieType } from './uderjanie-dialog'
import { getVacantRayon } from './utils'
import { Vacants } from './vacants'

export interface ImportPlastikProps {
  onSelect: (nachislenie: UderjaniePlastik) => void
}
export const ImportPlastik = ({ onSelect }: ImportPlastikProps) => {
  const [selectedVacant, setSelectedVacant] = useState<RelationTreeNode<Vacant, number | null>>()
  const [selectedRow, setSelectedRow] = useState<Nachislenie>()

  return (
    <div className="h-full flex divide-x overflow-hidden">
      <aside className="w-full max-w-md relative overflow-y-auto">
        <Vacants
          selected={selectedVacant}
          onSelect={setSelectedVacant}
        />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden divide-y">
        <NachislenieTable
          rayon={selectedVacant ? getVacantRayon(selectedVacant!) : undefined}
          onSelect={setSelectedRow}
        />
      </main>
      <UderjanieDialog
        type={UderjanieType.Plastik}
        tabelDocNum={selectedRow?.tabelDocNum}
        pending={false}
        open={!!selectedRow}
        onOpenChange={(open) => (!open ? setSelectedRow(undefined) : undefined)}
        onSelect={({ data }) => {
          onSelect(data?.[0])
        }}
      />
    </div>
  )
}
