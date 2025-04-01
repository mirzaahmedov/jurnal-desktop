import type { Nachislenie } from '@/common/models'
import type { Vacant } from '@renderer/common/models/vacant'

import { useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { vacantQueryKeys } from '@/app/region-admin/vacant/config'
import { getVacantListQuery } from '@/app/region-admin/vacant/service'
import { VacantTree } from '@/app/region-admin/vacant/vacant-tree'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { Button } from '@/common/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader } from '@/common/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useAuthenticationStore } from '@/common/features/auth'
import { useLayoutStore } from '@/common/features/layout'
import { useRequisitesStore } from '@/common/features/requisites'
import { type RelationTreeNode, arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

import {
  nachieslenieColumns,
  uderjanieAlimentColumns,
  uderjanieColumns,
  uderjanieDopOplataProvodkaColumns,
  uderjanieNachislenieProvodkaColumns,
  uderjanieProvodkaColumns
} from './columns'
import { NachislenieQueryKeys, UderjanieQueryKeys, uderjanieTypes } from './config'
import { BankRasxodImportService, NachislenieService, UderjanieService } from './service'
import { getVacantRayon } from './utils'

enum TabOption {
  Uderjanie = 'uderjanie',
  Aliment = 'aliment'
}

const ImportZarplataPage = () => {
  const navigate = useNavigate()
  const userOwnId = useAuthenticationStore((store) => store.user?.id)
  const setLayout = useLayoutStore((store) => store.setLayout)
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.Uderjanie)
  const [selectedVacant, setSelectedVacant] = useState<RelationTreeNode<Vacant, number | null>>()
  const [selectedRow, setSelectedRow] = useState<Nachislenie>()

  const { t } = useTranslation(['app'])

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [vacantQueryKeys.getAll, { userId: userOwnId! }],
    queryFn: getVacantListQuery,
    enabled: !!userOwnId
  })
  const { data: nachislenie, isFetching: isFetchingNachislenie } = useQuery({
    queryKey: [
      NachislenieQueryKeys.getAll,
      { userId: userOwnId!, rayon: selectedVacant ? getVacantRayon(selectedVacant!) : '' }
    ],
    queryFn: NachislenieService.getElementsByRayon,
    enabled: !!userOwnId && !!selectedVacant
  })
  const { data: uderjanie, isFetching: isFetchingUderjanie } = useQuery({
    queryKey: [
      NachislenieQueryKeys.getAll,
      { userId: userOwnId!, tabelDocNum: selectedRow?.tabelDocNum ?? 0 }
    ],
    queryFn: UderjanieService.getAll,
    enabled: !!userOwnId && !!selectedRow
  })

  const { data: aliment, isFetching: isFetchingAliment } = useQuery({
    queryKey: [
      UderjanieQueryKeys.getAliment,
      { userId: userOwnId!, tabelDocNum: selectedRow?.tabelDocNum ?? 0 }
    ],
    queryFn: UderjanieService.getAliment,
    enabled: !!userOwnId && !!selectedRow
  })

  const { mutate: importZarplata, isPending: isImportingZarplata } = useMutation({
    mutationFn: BankRasxodImportService.importZarplata,
    onSuccess: (res) => {
      toast.success(res?.message)
    }
  })

  useEffect(() => {
    setLayout({
      title: t('import_zarplata'),
      breadcrumbs: [
        {
          title: t('pages.bank')
        },
        {
          title: t('pages.rasxod-docs'),
          path: '/bank/rasxod'
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, t, navigate])

  const treeData = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants]
  )

  console.log({ selectedRow })

  return (
    <div className="h-full flex divide-x overflow-hidden">
      <aside className="w-full max-w-md relative overflow-y-auto">
        {isFetchingVacants ? <LoadingOverlay /> : null}
        <VacantTree
          data={treeData}
          selectedIds={selectedVacant ? [selectedVacant.id] : []}
          onSelectNode={(vacant) => {
            setSelectedVacant(vacant)
          }}
        />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden divide-y">
        <div className="relative flex-1 overflow-auto scrollbar">
          {isFetchingNachislenie ? <LoadingOverlay /> : null}
          <GenericTable
            columnDefs={nachieslenieColumns}
            data={nachislenie ?? []}
            className="table-generic-xs"
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
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value as TabOption)}
            className="h-full overflow-hidden flex flex-col"
          >
            <DrawerHeader className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value={TabOption.Uderjanie}>{t('uderjanie')}</TabsTrigger>
                <TabsTrigger value={TabOption.Aliment}>{t('aliment')}</TabsTrigger>
              </TabsList>
              <DrawerClose>
                <Button
                  size="icon"
                  variant="outline"
                >
                  <X className="btn-icon" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <TabsContent
              value={TabOption.Uderjanie}
              className="flex-1 overflow-hidden"
            >
              <div className="h-full overflow-auto scrollbar relative">
                {isFetchingUderjanie ? <LoadingOverlay /> : null}
                <CollapsibleTable
                  columnDefs={uderjanieColumns}
                  data={uderjanie ?? []}
                  getRowId={(row) => row.mainZarplataId}
                  getChildRows={() => []}
                  className="table-generic-xs"
                  renderChildRows={(_, parentRow) => {
                    return (
                      <div className="sticky left-0 pl-16">
                        <CollapsibleTable
                          displayHeader={false}
                          data={uderjanieTypes}
                          columnDefs={[{ key: 'name', renderCell: (row) => row.name }]}
                          getRowId={(row) => row.key}
                          getChildRows={() => []}
                          renderChildRows={(_, row) => {
                            const columns =
                              row.key === 'rootObjectNachislenie'
                                ? uderjanieNachislenieProvodkaColumns
                                : row.key === 'rootObjectUderjanie'
                                  ? uderjanieProvodkaColumns
                                  : uderjanieDopOplataProvodkaColumns
                            return (
                              <div className="pl-16">
                                <CollapsibleTable
                                  columnDefs={columns as any[]}
                                  data={(parentRow?.[row.key]?.rows as any[]) ?? []}
                                  getChildRows={() => undefined}
                                  getRowId={() => ''}
                                  getRowKey={(_, index) => index}
                                />
                              </div>
                            )
                          }}
                        />
                      </div>
                    )
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent
              value={TabOption.Aliment}
              className="flex-1 overflow-hidden"
            >
              <div className="h-full overflow-auto scrollbar relative">
                {isFetchingAliment ? <LoadingOverlay /> : null}
                <GenericTable
                  columnDefs={uderjanieAlimentColumns}
                  data={aliment ?? []}
                  className="table-generic-xs"
                />
              </div>
            </TabsContent>
            {tabValue === TabOption.Aliment ? (
              <div className="p-5">
                <Button
                  type="button"
                  loading={isImportingZarplata}
                  disabled={isImportingZarplata || !main_schet_id || !aliment}
                  onClick={() => {
                    if (!main_schet_id || !aliment) {
                      return
                    }
                    importZarplata({
                      main_schet_id: main_schet_id!,
                      data: aliment
                    })
                  }}
                >
                  {t('send')}
                </Button>
              </div>
            ) : null}
          </Tabs>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ImportZarplataPage
