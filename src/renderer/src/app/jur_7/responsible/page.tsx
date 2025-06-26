import type { Responsible } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile, ImportFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { ResponsibleColumns } from './columns'
import { ResponsibleQueryKeys } from './config'
import { ResponsibleDialog } from './dialog'
import { ResponsibleService } from './service'

const ResponsiblePage = () => {
  const setLayout = useLayout()

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<null | Responsible>(null)
  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id } = useRequisitesStore()

  const { data: responsibles, isFetching } = useQuery({
    queryKey: [
      ResponsibleQueryKeys.getAll,
      {
        search,
        budjet_id,
        ...pagination
      }
    ],
    queryFn: ResponsibleService.getAll
  })
  const { mutate: deleteResponsible, isPending } = useMutation({
    mutationKey: [ResponsibleQueryKeys.delete],
    mutationFn: ResponsibleService.delete,
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [ResponsibleQueryKeys.getAll]
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
        <ButtonGroup className="space-x-2">
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
              budjet_id,
              excel: true
            }}
            fileName={`${t('responsible')}.xlsx`}
            buttonText={t('export-excel')}
          />
          <ImportFile
            url="/jur_7/responsible/import"
            params={{
              budjet_id
            }}
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: [ResponsibleQueryKeys.getAll]
              })
            }}
          />
        </ButtonGroup>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={ResponsibleColumns}
          data={responsibles?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={responsibles?.meta?.count ?? 0}
          pageCount={responsibles?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <ResponsibleDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
    </ListView>
  )
}

export default ResponsiblePage
