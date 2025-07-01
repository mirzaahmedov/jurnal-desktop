import type { MainZarplata } from '@/common/models'

import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'

import { VacantTree, type VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { VacantService } from '@/common/features/vacant/service'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

import { MainZarplataColumnDefs } from './columns'
import { PassportInfoCreateDialog } from './create-dialog'
import { PassportInfoDialog } from './info-dialog'

const PassportInfoPage = () => {
  const setLayout = useLayout()

  const createDialogToggle = useToggle()
  const editDialogToggle = useToggle()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)
  const [selectedUser, setSelectedUser] = useState<MainZarplata | undefined>()

  const { t } = useTranslation(['app'])

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [VacantService.QueryKeys.GetAll, { page: 1, limit: 100000000000000 }],
    queryFn: VacantService.getAll
  })
  const { data: users, isFetching: isFetchingUsers } = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetAll,
      {
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!selectedVacant
  })

  useEffect(() => {
    setLayout({
      title: t('pages.passport_info'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      onCreate: selectedVacant ? createDialogToggle.open : undefined
    })
  }, [t, setLayout, selectedVacant])

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants]
  )

  const handleRowEdit = (row: MainZarplata) => {
    setSelectedUser(row)
    editDialogToggle.open()
  }

  return (
    <>
      <Allotment className="h-full">
        <Allotment.Pane
          preferredSize={300}
          maxSize={600}
          minSize={200}
          className="w-full"
        >
          <div className="relative overflow-auto scrollbar h-full">
            {isFetchingVacants ? <LoadingOverlay /> : null}
            <VacantTree
              data={treeNodes}
              selectedIds={selectedVacant ? [selectedVacant.id] : []}
              onSelectNode={setSelectedVacant}
            />
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div className="relative w-full overflow-auto scrollbar">
            {isFetchingUsers ? <LoadingOverlay /> : null}
            <GenericTable
              data={users ?? []}
              columnDefs={MainZarplataColumnDefs}
              onEdit={handleRowEdit}
            />
          </div>
        </Allotment.Pane>
      </Allotment>

      {selectedVacant ? (
        <PassportInfoDialog
          isOpen={editDialogToggle.isOpen}
          onOpenChange={editDialogToggle.setOpen}
          selectedUser={selectedUser}
          vacant={selectedVacant}
        />
      ) : null}

      {selectedVacant ? (
        <PassportInfoCreateDialog
          isOpen={createDialogToggle.isOpen}
          onOpenChange={createDialogToggle.setOpen}
          selectedUser={undefined}
          vacant={selectedVacant}
          onCreate={(user) => {
            setSelectedUser(user)
            editDialogToggle.open()
            createDialogToggle.close()
          }}
        />
      ) : null}
    </>
  )
}

export default PassportInfoPage
