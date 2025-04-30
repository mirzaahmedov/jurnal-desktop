import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { useConfirm } from '@/common/features/confirm'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { type Operatsii } from '@/common/models'
import { ListView } from '@/common/views'

import { OperatsiiColumns } from './columns'
import { operatsiiQueryKeys } from './config'
import { type OperatsiiFormValues } from './config'
import { OperatsiiDialog } from './dialog'
import { OperatsiiFilter, useTypeSchetFilter } from './filter'
import { OperatsiiService } from './service'

const OperatsiiPage = () => {
  const [selected, setSelected] = useState<Operatsii | null>(null)
  const [original, setOriginal] = useState<Partial<OperatsiiFormValues> | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayout()

  const [typeSchet] = useTypeSchetFilter()
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: operatsii, isFetching } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        ...pagination,
        type_schet: typeSchet,
        search
      },
      typeSchet
    ],
    queryFn: OperatsiiService.getAll,
    placeholderData: (prev) => prev
  })
  const { mutate: deleteOperatsii, isPending } = useMutation({
    mutationKey: [operatsiiQueryKeys.delete],
    mutationFn: OperatsiiService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.operatsii'),
      content: OperatsiiFilter,
      onCreate: () => {
        dialogToggle.open()
        setSelected(null)
        setOriginal(null)
      }
    })
  }, [setLayout, dialogToggle.open, t])

  const handleClickEdit = (row: Operatsii) => {
    setSelected(row)
    setOriginal(null)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Operatsii) => {
    confirm({
      onConfirm() {
        deleteOperatsii(row.id)
      }
    })
  }
  const handleClickDuplicate = (row: Operatsii) => {
    setSelected(null)
    setOriginal({
      schet: row.schet,
      type_schet: row.type_schet,
      smeta_id: row.smeta_id,
      sub_schet: row.sub_schet
    })
    requestAnimationFrame(() => {
      dialogToggle.open()
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={operatsii?.data ?? []}
          columnDefs={OperatsiiColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          actions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                >
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="left"
                className="p-2"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem
                  className="text-slate-600 hover:!text-brand cursor-pointer"
                  onSelect={() => handleClickDuplicate(row)}
                >
                  <CopyPlus className="btn-icon" />
                  <span className="text-sm font-medium">{t('duplicate')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={operatsii?.meta?.count ?? 0}
          pageCount={operatsii?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <OperatsiiDialog
        selected={selected}
        original={original}
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default OperatsiiPage
