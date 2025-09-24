import type { AdminZarplataDashboard } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { Briefcase, Files, Users } from 'lucide-react'

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

import { AdminZarplataMainSchetColumnDefs } from './columns'
import { ViewDocumentsModal } from './view-documents-modal'
import { ViewMainZarplataModal } from './view-main-zarplata'
import { ViewVacantsModal } from './view-vacants-modal'

export interface ViewModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: AdminZarplataDashboard | null
}
export const ViewModal = ({ selected, ...props }: ViewModalProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [regionId, setRegionId] = useState<number | null>(null)
  const [budjetId, setBudjetId] = useState<number | null>(null)

  const docsViewToggle = useToggle()
  const vacantsViewToggle = useToggle()
  const mainZarplataViewToggle = useToggle()

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
                getRowId={(row) => row.mainSchetId.toString()}
                actionsWidth={180}
                actions={(row) => {
                  return (
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onPress={() => {
                          setSelectedId(row.mainSchetId)
                          docsViewToggle.open()
                        }}
                      >
                        <Files className="btn-icon" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onPress={() => {
                          setRegionId(selected?.regionId ?? null)
                          setBudjetId(row.spravochnikBudjetNameId ?? null)
                          vacantsViewToggle.open()
                        }}
                      >
                        <Briefcase className="btn-icon" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onPress={() => {
                          setRegionId(selected?.regionId ?? null)
                          setBudjetId(row.spravochnikBudjetNameId ?? null)
                          mainZarplataViewToggle.open()
                        }}
                      >
                        <Users className="btn-icon" />
                      </Button>
                    </div>
                  )
                }}
              />
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
      <ViewDocumentsModal
        isOpen={docsViewToggle.isOpen}
        onOpenChange={docsViewToggle.setOpen}
        selectedId={selectedId}
      />
      <ViewVacantsModal
        regionId={regionId}
        budjetId={budjetId}
        isOpen={vacantsViewToggle.isOpen}
        onOpenChange={vacantsViewToggle.setOpen}
      />
      <ViewMainZarplataModal
        regionId={regionId}
        budjetId={budjetId}
        isOpen={mainZarplataViewToggle.isOpen}
        onOpenChange={mainZarplataViewToggle.setOpen}
      />
    </>
  )
}
