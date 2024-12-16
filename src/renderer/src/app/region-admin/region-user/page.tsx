import type { User } from '@/common/models'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { regionUserService } from './service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { regionUserColumns } from './columns'
import { regionUserKeys } from './constants'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'
import RegionUserDialog from './dialog'

const RegionUserPage = () => {
  const [selected, setSelected] = useState<User | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()

  const { data: regionUsers, isFetching } = useQuery({
    queryKey: [regionUserKeys.getAll],
    queryFn: regionUserService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [regionUserKeys.delete],
    mutationFn: regionUserService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [regionUserKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])

  useLayout({
    title: 'Пользователи',
    onCreate: toggle.open
  })

  const handleClickEdit = (row: User) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: User) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={regionUsers?.data ?? []}
          columns={regionUserColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </div>
      <RegionUserDialog data={selected} open={toggle.isOpen} onChangeOpen={toggle.setIsOpen} />
    </>
  )
}

export default RegionUserPage
