import type { Group } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useConfirm } from '@/common/features/confirm'
import { DownloadFile, ImportFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { GroupColumns } from './columns'
import { GroupQueryKeys } from './config'
import { GroupDialog } from './dialog'
import { GroupService, GroupTable } from './service'

const GroupPage = () => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<null | Group>(null)
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: groups, isFetching } = useQuery({
    queryKey: [
      GroupQueryKeys.getAll,
      {
        search,
        page: 1,
        limit: 10000
      }
    ],
    queryFn: GroupService.getAll
  })
  const { mutate: deleteGroup, isPending } = useMutation({
    mutationKey: [GroupQueryKeys.delete],
    mutationFn: GroupService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [GroupQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.group'),
      content: SearchFilterDebounced,
      onCreate() {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, dialogToggle.open, t])

  const handleClickEdit = (row: Group) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Group) => {
    confirm({
      onConfirm() {
        deleteGroup(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Header className="flex items-center justify-end">
        <div className="flex items-center gap-2.5">
          <ImportFile url="/jur_7/group/import" />
          <DownloadFile
            url="/jur_7/group/export"
            params={{
              page: 1,
              limit: 10000000,
              excel: true
            }}
            fileName={`${t('group')}.xlsx`}
            buttonText={t('export-excel')}
          />
        </div>
      </ListView.Header>
      <ListView.Content isLoading={isFetching || isPending}>
        <GroupTable
          columnDefs={GroupColumns}
          data={groups?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <GroupDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.close}
      />
    </ListView>
  )
}

export default GroupPage
