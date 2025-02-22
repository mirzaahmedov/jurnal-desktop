import type { Responsible } from '@/common/models'

import { useEffect, useState } from 'react'

import { DownloadFile } from '@renderer/common/features/file'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { toast } from '@/common/hooks/use-toast'
import { useToggle } from '@/common/hooks/use-toggle'

import { responsibleColumns } from './columns'
import { responsibleQueryKeys } from './constants'
import { ResponsibleDialog } from './dialog'
import { responsibleService } from './service'

const ResponsiblePage = () => {
  const [selected, setSelected] = useState<null | Responsible>(null)

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const setLayout = useLayoutStore((store) => store.setLayout)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const { data: responsibleList, isFetching } = useQuery({
    queryKey: [
      responsibleQueryKeys.getAll,
      {
        search,
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
          title: t('pages.material-warehouse')
        }
      ],
      content: SearchField,
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
      <ListView.Header>
        <DownloadFile
          url="/jur_7/responsible"
          params={{
            page: 1,
            limit: 9999,
            excel: true
          }}
          fileName={`${t('responsible')}.xlsx`}
          buttonText={t('export-excel')}
        />
      </ListView.Header>
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
          pageCount={responsibleList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <ResponsibleDialog
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
        selected={selected}
      />
    </ListView>
  )
}

export default ResponsiblePage
