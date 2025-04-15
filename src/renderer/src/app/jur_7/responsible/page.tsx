import type { Responsible } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile, ImportFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { responsibleColumns } from './columns'
import { responsibleQueryKeys } from './constants'
import { ResponsibleDialog } from './dialog'
import { responsibleService } from './service'

const ResponsiblePage = () => {
  const [selected, setSelected] = useState<null | Responsible>(null)
  const [search] = useSearchFilter()

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
        search,
        ...pagination
      }
    ],
    queryFn: responsibleService.getAll
  })
  const { mutate: deleteResponsible, isPending } = useMutation({
    mutationKey: [responsibleQueryKeys.delete],
    mutationFn: responsibleService.delete,
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [responsibleQueryKeys.getAll]
      })
      toast.success(res?.message)
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
      content: SearchFilterDebounced,
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
      onConfirm: () => deleteResponsible(row.id)
    })
  }

  return (
    <ListView>
      <ListView.Header className="flex items-center justify-end">
        <DownloadFile
          url="/jur_7/responsible/template"
          params={{
            excel: true
          }}
          fileName={`${t('responsible')}_${t('template')}.xlsx`}
          buttonText={t('download-something', { something: t('template') })}
        />
        <DownloadFile
          url="/jur_7/responsible"
          params={{
            page: 1,
            limit: 1000000,
            excel: true
          }}
          fileName={`${t('responsible')}.xlsx`}
          buttonText={t('export-excel')}
        />
        <ImportFile
          url="/jur_7/responsible/import"
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [responsibleQueryKeys.getAll]
            })
          }}
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
