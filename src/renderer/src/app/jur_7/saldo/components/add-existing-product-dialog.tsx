import type { MaterialPrixodProduct } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'

import { MaterialPrixodQueryKeys } from '@/app/jur_7/prixod/config'
import { MaterialPrixodService } from '@/app/jur_7/prixod/service'
import { type ColumnDef, GenericTable, LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { pageSizeOptions } from '@/common/components/pagination'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { IDCell } from '@/common/components/table/renderers/id'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/common/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'

const ProductColumnDefs: ColumnDef<MaterialPrixodProduct>[] = [
  {
    key: 'id',
    width: 160,
    minWidth: 160,
    renderCell: IDCell
  },
  {
    key: 'name'
  },
  {
    key: 'serial_num',
    header: 'serial-num'
  },
  {
    key: 'inventar_num',
    header: 'inventar-num'
  },
  {
    key: 'edin',
    header: 'ei'
  }
]

enum TabOption {
  ALL = 'ALL',
  SELECTED = 'SELECTED'
}

export interface AddExistingProductDialogProps extends DialogProps {
  responsible_id: number
  to: string
  disabledIds: (string | number)[]
  onSelect: (selected: MaterialPrixodProduct[]) => void
}
export const AddExistingProductDialog = ({
  open,
  onOpenChange,
  disabledIds,
  onSelect,
  responsible_id
}: AddExistingProductDialogProps) => {
  const pagination = usePagination()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const [search, setSearch] = useState('')
  const [tabValue, setTabValue] = useState(TabOption.ALL)
  const [selectedRows, setSelectedRows] = useState<MaterialPrixodProduct[]>([])

  const { t } = useTranslation()

  const { data: products, isFetching } = useQuery({
    queryKey: [
      MaterialPrixodQueryKeys.getProducts,
      {
        page: pagination.page,
        limit: pagination.limit,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        responsible_id
      }
    ],
    queryFn: MaterialPrixodService.getProducts,
    enabled: !!main_schet_id && !!budjet_id && !!responsible_id
  })

  useEffect(() => {
    if (!open) {
      setSearch('')
      setTabValue(TabOption.ALL)
      setSelectedRows([])
    }
  }, [open])

  const selectedIds = useMemo(() => selectedRows.map((e) => e.id), [selectedRows])

  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-full w-full p-0 h-0 min-h-[70%] overflow-hidden gap-0 flex flex-col">
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value as TabOption)}
            className="flex flex-col h-full overflow-hidden"
          >
            <DialogHeader className="flex-0 px-5 py-1 flex gap-10 items-center flex-row">
              <DialogTitle>{t('products')}</DialogTitle>
              <TabsList>
                <TabsTrigger value={TabOption.ALL}>{t('add')}</TabsTrigger>
                <TabsTrigger
                  value={TabOption.SELECTED}
                  className="flex items-center gap-5"
                >
                  {t('selected_products')}
                  {selectedRows.length ? <Badge>{selectedRows.length}</Badge> : null}
                </TabsTrigger>
              </TabsList>
              {tabValue === TabOption.ALL ? (
                <SearchInputDebounced
                  value={search}
                  onValueChange={setSearch}
                />
              ) : null}
            </DialogHeader>
            <TabsContent
              value={TabOption.SELECTED}
              className="hidden data-[state=active]:flex flex-1 flex-col overflow-hidden relative"
            >
              {isFetching ? <LoadingOverlay /> : null}
              <div className="flex-1 overflow-auto scrollbar">
                <GenericTable
                  columnDefs={ProductColumnDefs}
                  data={selectedRows ?? []}
                  getRowId={(row) => row.id}
                  onDelete={(product) => {
                    setSelectedRows((prev) => {
                      if (prev.find((o) => o.id === product.id)) {
                        return prev.filter((o) => o.id !== product.id)
                      }
                      return prev
                    })
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent
              value={TabOption.ALL}
              className="hidden data-[state=active]:block w-full flex-1 relative overflow-auto scrollbar"
            >
              {isFetching ? <LoadingOverlay /> : null}
              <GenericTable
                selectedIds={selectedIds}
                disabledIds={disabledIds}
                data={products?.data ?? []}
                columnDefs={ProductColumnDefs}
                getRowId={(row) => row.id}
                className="w-full"
                onClickRow={(product) => {
                  setSelectedRows((prev) => {
                    if (prev.find((o) => o.id === product.id)) {
                      return prev.filter((o) => o.id !== product.id)
                    }
                    return [...prev, product]
                  })
                }}
              />
            </TabsContent>
          </Tabs>
          <DialogFooter className="p-0 m-0">
            <div className="w-full p-5 flex items-center justify-between">
              <div className="flex-0 p-5 flex items-center gap-10">
                {products?.meta?.pageCount ? (
                  <>
                    <ReactPaginate
                      className="flex gap-4"
                      pageRangeDisplayed={2}
                      breakLabel="..."
                      forcePage={pagination.page - 1}
                      onPageChange={({ selected }) => pagination.onChange({ page: selected + 1 })}
                      pageLabelBuilder={(item) => (
                        <Button
                          variant={pagination.page === item ? 'outline' : 'ghost'}
                          size="icon"
                        >
                          {item}
                        </Button>
                      )}
                      nextLabel={
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <ArrowRight className="btn-icon !ml-0" />
                        </Button>
                      }
                      previousLabel={
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <ArrowLeft className="btn-icon !ml-0" />
                        </Button>
                      }
                      pageCount={products?.meta?.pageCount ?? 0}
                      renderOnZeroPageCount={null}
                    />
                    {products?.meta?.count ? (
                      <div className="flex items-center gap-10">
                        <span className="whitespace-nowrap text-sm font-medium text-slate-600">
                          {t('pagination.range', {
                            from: (pagination.page - 1) * pagination.limit + 1,
                            to:
                              (pagination.page - 1) * pagination.limit +
                              (pagination.page * pagination.limit > products?.meta?.count
                                ? products?.meta?.count % pagination.limit
                                : pagination.limit),
                            total: products?.meta?.count
                          })}
                        </span>
                        <div className="flex items-center gap-5">
                          <span className="whitespace-nowrap text-sm font-medium text-slate-600">
                            {t('pagination.page_size')}
                          </span>
                          <div className="w-20">
                            <Select
                              value={String(pagination.limit)}
                              onValueChange={(value) =>
                                pagination.onChange({ limit: Number(value) })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={String(pagination.limit)} />
                              </SelectTrigger>
                              <SelectContent>
                                {pageSizeOptions.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={String(item.value)}
                                  >
                                    {item.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>

              <Button
                disabled={isFetching}
                isPending={isFetching}
                onClick={() => {
                  onSelect?.(selectedRows)
                  onOpenChange?.(false)
                }}
                className="ml-auto"
              >
                {t('add')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
