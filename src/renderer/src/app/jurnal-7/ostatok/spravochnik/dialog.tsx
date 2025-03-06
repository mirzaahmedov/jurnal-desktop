import type { DialogProps } from '@radix-ui/react-dialog'
import type { OstatokProduct } from '@renderer/common/models'

import { useEffect, useMemo, useState } from 'react'

import { GenericTable, LoadingOverlay } from '@renderer/common/components'
import { Pagination } from '@renderer/common/components/pagination'
import { Badge } from '@renderer/common/components/ui/badge'
import { Button } from '@renderer/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/common/components/ui/tabs'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { ostatokProductColumns } from '../columns'
import { ostatokQueryKeys } from '../config'
import { OstatokViewOption, getOstatokListQuery } from '../service'

enum TabOption {
  ALL = 'ALL',
  SELECTED = 'SELECTED'
}

export interface OstatokSpravochnikDialogProps extends DialogProps {
  kimning_buynida: number
  to: string
  disabledIds: number[]
  onSelect: (selected: OstatokProduct[]) => void
}
export const OstatokSpravochnikDialog = ({
  open,
  onOpenChange,
  to,
  kimning_buynida,
  disabledIds,
  onSelect
}: OstatokSpravochnikDialogProps) => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const [tabValue, setTabValue] = useState(TabOption.ALL)
  const [selected, setSelected] = useState<OstatokProduct[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { t } = useTranslation()
  const { data: ostatok, isFetching } = useQuery({
    queryKey: [
      ostatokQueryKeys.getAll,
      {
        type: OstatokViewOption.PRODUCT,
        to,
        budjet_id: budjet_id!,
        page,
        limit,
        kimning_buynida,
        search: search ? search : undefined
      }
    ],
    queryFn: getOstatokListQuery,
    enabled: !!budjet_id && !!kimning_buynida
  })

  useEffect(() => {
    if (!open) {
      setSearch('')
      setPage(1)
      setTabValue(TabOption.ALL)
      setSelected([])
    }
  }, [open])

  const selectedIds = useMemo(() => selected.map((e) => e.naimenovanie_tovarov_jur7_id), [selected])

  console.log({ disabledIds })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-screen-7xl w-full p-0 h-0 min-h-[70%] overflow-hidden gap-0 flex flex-col">
        <Tabs
          value={tabValue}
          onValueChange={(value) => setTabValue(value as TabOption)}
          className="flex flex-col h-full overflow-hidden"
        >
          <DialogHeader className="flex-0 px-5 py-1 flex gap-10 items-center flex-row justify-between">
            <DialogTitle>{t('products')}</DialogTitle>
            <div className="flex-1 flex items-center">
              <TabsList>
                <TabsTrigger value={TabOption.ALL}>{t('add')}</TabsTrigger>
                <TabsTrigger
                  value={TabOption.SELECTED}
                  className="flex items-center gap-5"
                >
                  {t('selected_products')}
                  {selected.length ? <Badge>{selected.length}</Badge> : null}
                </TabsTrigger>
              </TabsList>
            </div>
          </DialogHeader>
          <TabsContent
            value={TabOption.SELECTED}
            className="hidden data-[state=active]:flex flex-1 flex-col overflow-hidden relative"
          >
            {isFetching ? <LoadingOverlay /> : null}
            <div className="flex-1 overflow-auto scrollbar">
              <GenericTable
                columnDefs={ostatokProductColumns}
                data={selected ?? []}
                getRowId={(row) => row.naimenovanie_tovarov_jur7_id}
                onDelete={(organization) => {
                  setSelected((prev) => {
                    if (prev.find((o) => o.id === organization.id)) {
                      return prev.filter((o) => o.id !== organization.id)
                    }
                    return prev
                  })
                }}
              />
            </div>
          </TabsContent>

          <TabsContent
            value={TabOption.ALL}
            className="hidden data-[state=active]:flex flex-1 flex-col overflow-hidden relative"
          >
            {isFetching ? <LoadingOverlay /> : null}
            <div className="flex-1 overflow-auto scrollbar">
              <GenericTable
                selectedIds={selectedIds}
                disabledIds={disabledIds}
                columnDefs={ostatokProductColumns}
                getRowId={(row) => row.naimenovanie_tovarov_jur7_id}
                data={ostatok?.data?.products ?? []}
                onClickRow={(organization) => {
                  setSelected((prev) => {
                    if (prev.find((o) => o.id === organization.id)) {
                      return prev.filter((o) => o.id !== organization.id)
                    }
                    return [...prev, organization]
                  })
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="p-0 m-0">
          <div className="w-full p-5 flex items-center">
            {tabValue === TabOption.ALL ? (
              <Pagination
                page={page}
                limit={limit}
                onChange={({ page, limit }) => {
                  if (page) {
                    setPage(page)
                  }
                  if (limit) {
                    setLimit(limit)
                  }
                }}
                pageCount={ostatok?.meta?.pageCount ?? 0}
              />
            ) : null}
            <Button
              disabled={isFetching}
              loading={isFetching}
              onClick={() => {
                onSelect?.(selected)
                onOpenChange?.(false)
              }}
              className="ml-auto"
            >
              {t('add')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
