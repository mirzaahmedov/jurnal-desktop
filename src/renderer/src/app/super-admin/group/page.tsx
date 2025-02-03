import type { Group } from '@/common/models'

import { useState } from 'react'

import { SearchField, useSearch } from '@renderer/common/features/search'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { toast } from '@/common/hooks/use-toast'
import { useToggle } from '@/common/hooks/use-toggle'

import { groupColumns } from './columns'
import { groupQueryKeys } from './constants'
import GroupDialog from './dialog'
import { GroupTable, groupService } from './service'

const GroupPage = () => {
  const [selected, setSelected] = useState<null | Group>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { confirm } = useConfirm()

  const { data: groupList, isFetching } = useQuery({
    queryKey: [
      groupQueryKeys.getAll,
      {
        search,
        page: 1,
        limit: 10000
      }
    ],
    queryFn: groupService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [groupQueryKeys.delete],
    mutationFn: groupService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [groupQueryKeys.getAll]
      })
      toast({
        title: 'Группа удалена'
      })
    },
    onError() {
      toast({
        title: 'Ошибка при удалении группы',
        variant: 'destructive'
      })
    }
  })

  useLayout({
    title: t('pages.group'),
    content: SearchField,
    onCreate() {
      setSelected(null)
      dialogToggle.open()
    }
  })

  const handleClickEdit = (row: Group) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Group) => {
    confirm({
      title: 'Удалить группу?',
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GroupTable
          columnDefs={groupColumns}
          data={groupList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <GroupDialog
        data={selected}
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
      />
    </ListView>
  )
}

export default GroupPage
