import type { DialogProps } from '@radix-ui/react-dialog'
import type { Autocomplete } from '@renderer/common/lib/types'
import type { Organization } from '@renderer/common/models'

import { type ReactNode, type TableHTMLAttributes, useEffect, useMemo, useState } from 'react'

import { Pagination } from '@renderer/common/components/pagination'
import { Badge } from '@renderer/common/components/ui/badge'
import { Button } from '@renderer/common/components/ui/button'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableFooter,
  TableHeader,
  type TableProps
} from '@renderer/common/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/common/components/ui/tabs'
import { formatNumber } from '@renderer/common/lib/format'
import { cn } from '@renderer/common/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

import {
  Copyable,
  GenericTable,
  GenericTableCell,
  GenericTableHead,
  GenericTableRow,
  LoadingOverlay
} from '@/common/components'
import { EmptyList } from '@/common/components/empty-states'

import { organizationColumns } from './columns'
import { organizationQueryKeys } from './config'
import { organizationService, updateChildOrganizationsQuery } from './service'

enum TabOption {
  ALL = 'ALL',
  SELECTED = 'SELECTED'
}

interface SubordinateOrganizationsProps extends DialogProps {
  parentId?: number
}
export const SubordinateOrganizations = ({
  parentId,
  open,
  onOpenChange
}: SubordinateOrganizationsProps) => {
  const [tabValue, setTabValue] = useState(TabOption.SELECTED)
  const [selected, setSelected] = useState<Organization[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { t } = useTranslation()

  const { data: organization, isFetching } = useQuery({
    queryKey: [organizationQueryKeys.getById, parentId],
    queryFn: organizationService.getById,
    enabled: !!parentId
  })
  const { data: organizations, isFetching: isFetchingOrganizations } = useQuery({
    queryKey: [
      organizationQueryKeys.getAll,
      {
        page,
        limit,
        parent: false,
        parent_id: parentId
      }
    ],
    queryFn: organizationService.getAll
  })

  const { mutate: updateChildOrganizations, isPending } = useMutation({
    mutationKey: [organizationQueryKeys.update],
    mutationFn: updateChildOrganizationsQuery,
    onSuccess(res) {
      onOpenChange?.(false)
      toast.success(res?.message)
    },
    onError(error) {
      toast.error(error?.message)
    }
  })

  useEffect(() => {
    if (!organization?.data?.childs) {
      return
    }
    setSelected(organization.data.childs)
  }, [organization])
  useEffect(() => {
    if (!parentId) {
      setPage(1)
    }
  }, [parentId])

  const selectedIds = useMemo(() => selected.map((o) => o.id), [selected])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-screen-2xl w-full p-0 h-3/5 overflow-hidden gap-0 flex flex-col">
        <Tabs
          value={tabValue}
          onValueChange={(value) => setTabValue(value as TabOption)}
          className="flex flex-col h-full overflow-hidden"
        >
          <DialogHeader className="flex-0 px-5 py-1 flex gap-10 items-center flex-row justify-between">
            <DialogTitle>{t('subordinate-organizations')}</DialogTitle>
            <div className="flex-1 flex items-center">
              <TabsList>
                <TabsTrigger
                  value={TabOption.SELECTED}
                  className="flex items-center gap-5"
                >
                  {t('selected_organizations')}
                  {selected.length ? <Badge>{selected.length}</Badge> : null}
                </TabsTrigger>
                <TabsTrigger value={TabOption.ALL}>{t('add')}</TabsTrigger>
              </TabsList>
            </div>
          </DialogHeader>
          <TabsContent
            value={TabOption.SELECTED}
            className="data-[state=active]:flex-1 flex flex-col overflow-hidden relative"
          >
            {isFetching || isFetchingOrganizations ? <LoadingOverlay /> : null}
            <div className="flex-1 overflow-auto scrollbar">
              <GenericTable
                columnDefs={organizationColumns}
                data={selected ?? []}
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
            className="data-[state=active]:flex-1 data-[state=active]:flex flex-col overflow-hidden relative"
          >
            {isFetching || isFetchingOrganizations ? <LoadingOverlay /> : null}
            <div className="flex-1 overflow-auto scrollbar">
              <MultiSelectSpravochnikTable
                selectedIds={selectedIds}
                columnDefs={columnDefs}
                data={organizations?.data ?? []}
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
                pageCount={organizations?.meta?.pageCount ?? 0}
              />
            ) : null}
            <Button
              disabled={!parentId}
              loading={isPending}
              onClick={() => {
                if (!parentId) {
                  return
                }
                updateChildOrganizations({
                  parentId,
                  childs: selectedIds.map((id) => ({
                    id
                  }))
                })
              }}
              className="ml-auto"
            >
              {t('save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type ColumnDef<T extends object> = {
  numeric?: boolean
  fit?: boolean
  stretch?: boolean
  key: Autocomplete<keyof T>
  header?: ReactNode
  className?: string
  width?: number
  headerClassName?: string
  rowSpan?: number
  colSpan?: number
  renderHeader?(row: T): ReactNode
  renderCell?(row: T, col: ColumnDef<T>, params: unknown): ReactNode
}

export type MultiSelectSpravochnikTableProps<T extends object> =
  TableHTMLAttributes<HTMLTableElement> &
    TableProps & {
      caption?: string
      data: T[]
      columnDefs: ColumnDef<T>[]
      placeholder?: string
      selectedIds?: number[]
      disabledIds?: number[]
      getRowId?(row: T): string | number
      onClickRow?(row: T): void
      onDelete?(row: T): void
      onEdit?(row: T): void
      customActions?: (row: T) => ReactNode
      activeRowId?: string | number
      footer?: ReactNode
    }
export const MultiSelectSpravochnikTable = <T extends object>({
  caption,
  data,
  columnDefs,
  placeholder,
  getRowId = defaultRowIdGetter,
  disabledIds = [],
  selectedIds = [],
  onClickRow,
  onDelete,
  onEdit,
  activeRowId,
  footer,
  customActions,
  ...props
}: MultiSelectSpravochnikTableProps<T>) => {
  const [selectedRowRef, setSelectedRowRef] = useState<HTMLElement | null>(null)

  const { t } = useTranslation()

  useEffect(() => {
    if (selectedRowRef) {
      selectedRowRef.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [selectedRowRef])

  return (
    <Table
      {...props}
      className={twMerge('relative', props.className)}
    >
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader className="sticky top-0 z-50 artificial-border">
        <GenericTableRow className="hover:bg-slate-100 border-t border-slate-200 bg-slate-100 even:bg-slate-100 even:hover:bg-slate-100">
          {Array.isArray(columnDefs)
            ? columnDefs.map((col) => {
                const {
                  key,
                  header,
                  fit,
                  stretch,
                  numeric,
                  headerClassName,
                  colSpan,
                  rowSpan,
                  width
                } = col
                return (
                  <GenericTableHead
                    key={key.toString()}
                    numeric={numeric}
                    fit={fit}
                    stretch={stretch}
                    className={headerClassName}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                    style={{ width }}
                  >
                    {!header ? t(key.toString()) : typeof header === 'string' ? t(header) : header}
                  </GenericTableHead>
                )
              })
            : null}
          {onDelete || onEdit || customActions ? (
            <GenericTableHead
              fit
              className="text-center"
              key="actions"
            >
              {t('actions')}
            </GenericTableHead>
          ) : null}
        </GenericTableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(data) && data.length ? (
          data.map((row) => {
            return (
              <GenericTableRow
                key={getRowId(row)}
                onClick={() => onClickRow?.(row)}
                ref={(el) => {
                  if (activeRowId === getRowId(row)) {
                    setSelectedRowRef(el)
                  }
                }}
                className={cn(
                  'group',
                  activeRowId === getRowId(row) &&
                    'ring-2 ring-inset ring-offset-1 ring-brand transition-none',
                  disabledIds.includes(Number(getRowId(row))) && 'opacity-50 pointer-events-none',
                  selectedIds.includes(Number(getRowId(row))) &&
                    '!bg-brand/10 border-brand/20 [&>td]:border-brand/20'
                )}
                data-selected={selectedIds.includes(Number(getRowId(row)))}
              >
                {Array.isArray(columnDefs)
                  ? columnDefs.map((col) => {
                      const { key, fit, stretch, numeric, renderCell, className, width } = col
                      return (
                        <GenericTableCell
                          key={key.toString()}
                          fit={fit}
                          stretch={stretch}
                          numeric={numeric}
                          className={cn(
                            activeRowId === getRowId(row) && 'text-brand/100',
                            className
                          )}
                          style={{ width }}
                        >
                          {typeof renderCell === 'function'
                            ? renderCell(row, col, { selectedIds })
                            : defaultCellRenderer(row, col)}
                        </GenericTableCell>
                      )
                    })
                  : null}

                {onDelete || onEdit || customActions ? (
                  <GenericTableCell className="py-1">
                    <div className="flex items-center whitespace-nowrap w-full gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(row)
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(row)
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                      {customActions?.(row)}
                    </div>
                  </GenericTableCell>
                ) : null}
              </GenericTableRow>
            )
          })
        ) : (
          <GenericTableRow className="pointer-events-none">
            <GenericTableCell
              colSpan={100}
              className="w-full text-center py-20 text-slate-400"
            >
              <EmptyList
                iconProps={{
                  className: 'w-40'
                }}
              >
                {placeholder}
              </EmptyList>
            </GenericTableCell>
          </GenericTableRow>
        )}
      </TableBody>
      {footer ? <TableFooter>{footer}</TableFooter> : null}
    </Table>
  )
}

const defaultCellRenderer = <T extends object>(row: T, col: ColumnDef<T>): ReactNode => {
  if (col.numeric) {
    return row[col.key as keyof T] ? formatNumber(Number(row[col.key as keyof T])) : '-'
  }
  return row[col.key as keyof T] ? String(row[col.key as keyof T]) : '-'
}
const defaultRowIdGetter = <T,>(row: T): string => {
  if (row !== null && typeof row === 'object' && 'id' in row) {
    return String(row['id'])
  }
  return ''
}

const columnDefs: ColumnDef<Organization>[] = [
  {
    key: 'id',
    className: 'pr-1',
    renderCell: (row, _, params) => {
      const { selectedIds } = params as {
        selectedIds: number[]
      }
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.includes(row.id)}
            className="size-5"
          />
          <Copyable value={row.id}>
            <b>#{row.id}</b>
          </Copyable>
        </div>
      )
    }
  },
  {
    key: 'name',
    className: 'min-w-[300px]'
  },
  {
    key: 'inn',
    className: 'pr-0',
    renderCell(row) {
      return (
        <Copyable
          value={row.inn}
          className="gap-0"
        >
          {row.inn}
        </Copyable>
      )
    }
  },
  {
    key: 'mfo',
    className: 'pr-0',
    renderCell(row) {
      return (
        <Copyable
          value={row.mfo}
          className="gap-0"
        >
          {row.mfo}
        </Copyable>
      )
    }
  },
  {
    key: 'bank_klient',
    header: 'bank',
    className: 'min-w-[300px] break-all'
  },
  {
    key: 'raschet_schet',
    header: 'raschet-schet',
    className: 'py-2 pr-0',
    renderCell(row) {
      return (
        <ul>
          {row.account_numbers?.map((schet) => (
            <li key={schet.id}>
              <Copyable
                className="gap-0"
                value={schet.raschet_schet}
              >
                {schet.raschet_schet}
              </Copyable>
            </li>
          ))}
        </ul>
      )
      return
    }
  },
  {
    fit: true,
    key: 'raschet_schet_gazna',
    header: 'raschet-schet-gazna',
    className: 'py-2 pr-0',
    renderCell(row) {
      return (
        <ul>
          {row.gaznas?.map((schet) => (
            <li key={schet.id}>
              <Copyable
                className="gap-0"
                value={schet.raschet_schet_gazna}
              >
                {schet.raschet_schet_gazna}
              </Copyable>
            </li>
          ))}
        </ul>
      )
    }
  }
]
