import { SearchField, useSearch } from '@renderer/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@/common/components'
import type { Group } from '@/common/models'
import GroupDialog from './dialog'
import { ListView } from '@renderer/common/views'
import { groupColumns } from './columns'
import { groupQueryKeys } from './constants'
import { groupService } from './service'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { usePagination } from '@renderer/common/hooks'
import { useState } from 'react'
import { useToggle } from '@/common/hooks/use-toggle'

const GroupPage = () => {
  const [selected, setSelected] = useState<null | Group>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const { search } = useSearch()
  const { confirm } = useConfirm()

  const { data: groupList, isFetching } = useQuery({
    queryKey: [
      groupQueryKeys.getAll,
      {
        search,
        ...pagination
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
    title: 'Группы',
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
        <GenericTable
          columns={groupColumns}
          data={groupList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination {...pagination} pageCount={groupList?.meta?.pageCount ?? 0} />
      </ListView.Footer>
      <GroupDialog data={selected} open={dialogToggle.isOpen} onClose={dialogToggle.close} />
    </ListView>
  )
}

export default GroupPage
