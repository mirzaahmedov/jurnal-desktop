import { useEffect, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/common/components/ui/dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useSearch } from '@/common/features/search/use-search'
import { usePagination } from '@/common/hooks'
import { useLocationState } from '@/common/hooks/use-location-state'
import { useToggle } from '@/common/hooks/use-toggle'
import { type Operatsii, TypeSchetOperatsii } from '@/common/models'
import { ListView } from '@/common/views'

import { operatsiiColumns } from './columns'
import { operatsiiQueryKeys } from './config'
import { OperatsiiDialog } from './dialog'
import { OperatsiiFilter } from './filter'
import { type OperatsiiFormValues, operatsiiService } from './service'

const OperatsiiPage = () => {
  const [selected, setSelected] = useState<Operatsii | null>(null)
  const [original, setOriginal] = useState<Partial<OperatsiiFormValues> | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [typeSchet] = useLocationState('type_schet', TypeSchetOperatsii.ALL)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: operations, isFetching } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        ...pagination,
        type_schet: typeSchet,
        search
      },
      typeSchet
    ],
    queryFn: operatsiiService.getAll,
    placeholderData: (prev) => prev
  })
  const { mutate: deleteOperatsii, isPending } = useMutation({
    mutationKey: [operatsiiQueryKeys.delete],
    mutationFn: operatsiiService.delete,
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
          data={operations?.data ?? []}
          columnDefs={operatsiiColumns}
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
          pageCount={operations?.meta?.pageCount ?? 0}
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
