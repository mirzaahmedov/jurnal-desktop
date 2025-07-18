import type { Nachislenie } from '@/common/models'
import type { Vacant } from '@/common/models/vacant'

import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { type RelationTreeNode } from '@/common/lib/tree/relation-tree'
import { getVacantRayon } from '@/common/utils/zarplata'

import { NachislenieTable } from './nachislenie-table'
import { BankRasxodImportService } from './service'
import { UderjanieDialog, UderjanieType } from './uderjanie-dialog'
import { Vacants } from './vacants'

export const ImportAliment = () => {
  const [selectedVacant, setSelectedVacant] = useState<RelationTreeNode<Vacant, number | null>>()
  const [selectedRow, setSelectedRow] = useState<Nachislenie>()

  const { mutate: importAliment, isPending: isImportingZarplata } = useMutation({
    mutationFn: BankRasxodImportService.importZarplata,
    onSuccess: (res) => {
      toast.success(res?.message)
    }
  })

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
        type={UderjanieType.Aliment}
        tabelDocNum={selectedRow?.tabelDocNum}
        pending={isImportingZarplata}
        open={!!selectedRow}
        onOpenChange={(open) => (!open ? setSelectedRow(undefined) : undefined)}
        onSelect={({ main_schet_id, data }) => {
          importAliment({
            data,
            main_schet_id
          })
        }}
      />
    </div>
  )
}
