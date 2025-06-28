import type { UderjanieAliment, UderjaniePlastik } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useAuthenticationStore } from '@/common/features/auth'
import { useRequisitesStore } from '@/common/features/requisites'

import {
  uderjanieAlimentColumns,
  uderjanieColumns,
  uderjanieDopOplataProvodkaColumns,
  uderjanieNachislenieProvodkaColumns,
  uderjaniePlastikColumns,
  uderjanieProvodkaColumns
} from './columns'
import { NachislenieQueryKeys, UderjanieQueryKeys, uderjanieTypes } from './config'
import { UderjanieService } from './service'

export enum UderjanieType {
  Aliment = 'aliment',
  Plastik = 'plastik'
}

enum TabOption {
  Uderjanie = 'uderjanie',
  Aliment = 'aliment',
  Plastik = 'plastik'
}

export interface UderjanieDialogProps extends DialogProps {
  pending: boolean
  type: UderjanieType
  tabelDocNum?: number
  onSelect: (values: {
    main_schet_id: number
    data: UderjanieAliment[] | UderjaniePlastik[]
  }) => void
}
export const UderjanieDialog = ({
  pending,
  type,
  tabelDocNum,
  onSelect,
  ...props
}: UderjanieDialogProps) => {
  const userOwnId = useAuthenticationStore((store) => store.user?.id)
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const [tabValue, setTabValue] = useState<TabOption>(
    type === UderjanieType.Plastik ? TabOption.Plastik : TabOption.Aliment
  )

  const { t } = useTranslation()

  const { data: uderjanie, isFetching: isFetchingUderjanie } = useQuery({
    queryKey: [NachislenieQueryKeys.getAll, { userId: userOwnId!, tabelDocNum: tabelDocNum ?? 0 }],
    queryFn: UderjanieService.getAll,
    enabled: !!userOwnId && !!tabelDocNum
  })

  const { data: aliment, isFetching: isFetchingAliment } = useQuery({
    queryKey: [
      UderjanieQueryKeys.getAliment,
      { userId: userOwnId!, tabelDocNum: tabelDocNum ?? 0 }
    ],
    queryFn: UderjanieService.getAliment,
    enabled: !!userOwnId && !!tabelDocNum && type === UderjanieType.Aliment
  })
  const { data: plastik, isFetching: isFetchingPlastik } = useQuery({
    queryKey: [
      UderjanieQueryKeys.getPlastik,
      { userId: userOwnId!, tabelDocNum: tabelDocNum ?? 0 }
    ],
    queryFn: UderjanieService.getPlastik,
    enabled: !!userOwnId && !!tabelDocNum && type === UderjanieType.Plastik
  })

  return (
    <DialogTrigger
      isOpen={props.open}
      onOpenChange={props.onOpenChange}
    >
      <DialogOverlay>
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
                  {type === UderjanieType.Aliment ? (
                    <TabsTrigger value={TabOption.Aliment}>{t('aliment')}</TabsTrigger>
                  ) : null}
                  {type === UderjanieType.Plastik ? (
                    <TabsTrigger value={TabOption.Plastik}>{t('plastik')}</TabsTrigger>
                  ) : null}
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

            {type === UderjanieType.Aliment ? (
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
            ) : null}

            {type === UderjanieType.Plastik ? (
              <TabsContent
                value={TabOption.Plastik}
                className="flex-1 overflow-hidden"
              >
                <div className="h-full overflow-auto scrollbar relative">
                  {isFetchingPlastik ? <LoadingOverlay /> : null}
                  <GenericTable
                    columnDefs={uderjaniePlastikColumns}
                    data={plastik ? [plastik] : []}
                    className="table-generic-xs"
                  />
                </div>
              </TabsContent>
            ) : null}

            {tabValue === TabOption.Aliment || tabValue === TabOption.Plastik ? (
              <div>
                <Button
                  type="button"
                  isPending={pending}
                  isDisabled={
                    pending ||
                    !main_schet_id ||
                    !(type === UderjanieType.Aliment ? aliment : plastik)
                  }
                  onClick={() => {
                    if (!main_schet_id) {
                      return
                    }
                    if (type === UderjanieType.Aliment && aliment) {
                      onSelect({
                        main_schet_id: main_schet_id!,
                        data: aliment
                      })
                      return
                    }
                    if (type === UderjanieType.Plastik && plastik) {
                      onSelect({
                        main_schet_id: main_schet_id!,
                        data: plastik ? [plastik] : []
                      })
                      return
                    }
                  }}
                >
                  {t('send')}
                </Button>
              </div>
            ) : null}
          </Tabs>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
