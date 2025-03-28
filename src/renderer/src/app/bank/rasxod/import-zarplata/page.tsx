import type { Nachislenie } from '@renderer/common/models'

import { useMemo, useState } from 'react'

import { vacantQueryKeys } from '@renderer/app/region-admin/vacant/config'
import { getVacantListQuery } from '@renderer/app/region-admin/vacant/service'
import { GenericTable } from '@renderer/common/components'
import { CollapsibleTable } from '@renderer/common/components/collapsible-table'
import { useElementWidth } from '@renderer/common/hooks'
import { arrayToTreeByRelations } from '@renderer/common/lib/tree/relation-tree'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { VacantTree } from '@/app/region-admin/vacant/vacant-tree'
import { Drawer, DrawerContent } from '@/common/components/ui/drawer'
import { useAuthenticationStore } from '@/common/features/auth'
import { useLayoutStore } from '@/common/features/layout'

import { nachieslenieColumns, uderjanieColumns } from './columns'
import { NachislenieQueryKeys } from './config'
import { NachislenieService, UderjanieService } from './service'

const ImportZarplataPage = () => {
  const userOwnId = useAuthenticationStore((store) => store.user?.id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [vacantId, setVacantId] = useState<number>()
  const [selectedRow, setSelectedRow] = useState<Nachislenie>()

  const { t } = useTranslation(['app'])

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [vacantQueryKeys.getAll, { userId: userOwnId! }],
    queryFn: getVacantListQuery,
    enabled: !!userOwnId
  })
  const { data: nachislenie } = useQuery({
    queryKey: [NachislenieQueryKeys.getAll, { userId: userOwnId!, vacantId: vacantId! }],
    queryFn: NachislenieService.getAll,
    enabled: !!userOwnId && !!vacantId
  })
  const { data: uderjanie } = useQuery({
    queryKey: [
      NachislenieQueryKeys.getAll,
      { userId: userOwnId!, tabelDocNum: selectedRow?.tabelDocNum ?? 0 }
    ],
    queryFn: UderjanieService.getAll,
    enabled: !!userOwnId && !!selectedRow
  })

  const treeData = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants]
  )

  return (
    <div className="h-full flex divide-x overflow-hidden">
      <aside className="max-w-lg">
        <VacantTree
          data={treeData}
          selectedIds={vacantId ? [vacantId] : []}
          onSelectNode={(vacant) => {
            setVacantId(vacant.id)
          }}
        />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden divide-y">
        <div className="flex-1 overflow-auto scrollbar">
          <GenericTable
            columnDefs={nachieslenieColumns}
            data={nachislenie ?? []}
            onClickRow={(row) => {
              setSelectedRow(row)
            }}
          />
        </div>
      </main>
      <Drawer
        open={!!selectedRow}
        onClose={() => setSelectedRow(undefined)}
      >
        <DrawerContent className="h-full max-h-[800px]">
          <div className="overflow-auto scrollbar relative">
            <CollapsibleTable
              columnDefs={uderjanieColumns}
              data={uderjanie ?? []}
              getRowId={(row) => row.mainZarplataId}
              getChildRows={() => []}
              renderChildRows={(_, parentRow) => (
                <div className="sticky left-0 pl-16">
                  <CollapsibleTable
                    displayHeader={false}
                    data={(
                      ['rootObjectNachislenie', 'rootObjectUderjanie', 'rootDopOplata'] as const
                    ).map((name) => ({ name }))}
                    columnDefs={[{ key: 'name' }]}
                    getRowId={(row) => row.name}
                    getChildRows={() => []}
                    renderChildRows={(_, row) => (
                      <div className="pl-16">
                        <CollapsibleTable
                          columnDefs={[
                            {
                              key: 'name'
                            },
                            {
                              key: 'foiz'
                            },
                            {
                              key: 'summa'
                            },
                            {
                              key: 'type_code'
                            }
                          ]}
                          data={parentRow?.[row.name]?.rows ?? []}
                          getChildRows={() => undefined}
                          getRowId={(row) => row.name}
                        />
                      </div>
                    )}
                  />
                </div>
              )}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ImportZarplataPage
