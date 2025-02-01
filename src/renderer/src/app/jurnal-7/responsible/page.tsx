import type { Responsible } from '@/common/models'

import { GenericTable } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { toast } from '@/common/hooks/use-toast'
import { useToggle } from '@/common/hooks/use-toggle'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { responsibleColumns } from './columns'
import { responsibleQueryKeys } from './constants'
import { responsibleService } from './service'

import ResponsibleDialog from './dialog'

const ResponsiblePage = () => {
  const [selected, setSelected] = useState<null | Responsible>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const setLayout = useLayoutStore((store) => store.setLayout)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const { data: responsibleList, isFetching } = useQuery({
    queryKey: [
      responsibleQueryKeys.getAll,
      {
        ...pagination
      }
    ],
    queryFn: responsibleService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [responsibleQueryKeys.delete],
    mutationFn: responsibleService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [responsibleQueryKeys.getAll]
      })
      toast({
        title: 'Материально-ответственное лицо успешно удалена'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при удалении материально-ответственное лицо',
        description: error.message
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.responsible'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      onCreate() {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: Responsible) => {
    dialogToggle.open()
    setSelected(row)
  }
  const handleClickDelete = (row: Responsible) => {
    confirm({
      title: 'Удалить материально-ответственное лицо?',
      onConfirm: () => deleteMutation(row.id)
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={responsibleColumns}
          data={responsibleList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={responsibleList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
      <ResponsibleDialog
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
        data={selected}
      />
    </ListView>
  )
}

export default ResponsiblePage
