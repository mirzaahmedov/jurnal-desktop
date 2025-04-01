import type { Nachislenie } from '@/common/models'
import type { Vacant } from '@renderer/common/models/vacant'

import { useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogHeader } from '@renderer/common/components/ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { Button } from '@/common/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useAuthenticationStore } from '@/common/features/auth'
import { useLayoutStore } from '@/common/features/layout'
import { useRequisitesStore } from '@/common/features/requisites'
import { type RelationTreeNode } from '@/common/lib/tree/relation-tree'

import {
  uderjanieAlimentColumns,
  uderjanieColumns,
  uderjanieDopOplataProvodkaColumns,
  uderjanieNachislenieProvodkaColumns,
  uderjanieProvodkaColumns
} from './columns'
import { NachislenieQueryKeys, UderjanieQueryKeys, uderjanieTypes } from './config'
import { NachislenieTable } from './nachislenie-table'
import { BankRasxodImportService, UderjanieService } from './service'
import { getVacantRayon } from './utils'
import { Vacants } from './vacants'

enum TabOption {
  Uderjanie = 'uderjanie',
  Aliment = 'aliment'
}

export const BankRasxodImportZarplata = () => {
  const navigate = useNavigate()
  const userOwnId = useAuthenticationStore((store) => store.user?.id)
  const setLayout = useLayoutStore((store) => store.setLayout)
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.Aliment)
  const [selectedVacant, setSelectedVacant] = useState<RelationTreeNode<Vacant, number | null>>()
  const [selectedRow, setSelectedRow] = useState<Nachislenie>()

  const { t } = useTranslation(['app'])

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
      <Dialog
        open={!!selectedRow}
        onOpenChange={(open) => (open ? undefined : setSelectedRow(undefined))}
      >
        <DialogContent className="w-full max-w-[1820px] h-full max-h-[980px] flex flex-col">
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value as TabOption)}
            className="h-full overflow-hidden flex flex-col gap-5"
          >
            <DialogHeader>
              <div>
                <TabsList>
                  <TabsTrigger value={TabOption.Uderjanie}>{t('uderjanie')}</TabsTrigger>
                  <TabsTrigger value={TabOption.Aliment}>{t('aliment')}</TabsTrigger>
                </TabsList>
              </div>
            </DialogHeader>
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
              <div>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
