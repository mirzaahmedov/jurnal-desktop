import type { User } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { RegionUserColumns } from './columns'
import { RegionUserQueryKeys } from './config'
import { RegionUserDialog } from './dialog'
import { RegionUserService } from './service'

const RegionUserPage = () => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<User | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: regionUsers, isFetching } = useQuery({
    queryKey: [RegionUserQueryKeys.getAll],
    queryFn: RegionUserService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [RegionUserQueryKeys.delete],
    mutationFn: RegionUserService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [RegionUserQueryKeys.getAll]
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
      title: t('pages.user'),
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ],
      onCreate: dialogToggle.open
    })
  }, [t, setLayout])

  const handleClickEdit = (row: User) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: User) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={regionUsers?.data ?? []}
          columnDefs={RegionUserColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
        <RegionUserDialog
          selected={selected}
          isOpen={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
      </ListView.Content>
    </ListView>
  )
}

export default RegionUserPage
