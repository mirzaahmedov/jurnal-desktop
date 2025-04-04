import type { User } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayoutStore } from '@/common/layout/store'

import { regionUserColumns } from './columns'
import { regionUserKeys } from './constants'
import RegionUserDialog from './dialog'
import { regionUserService } from './service'

const RegionUserPage = () => {
  const toggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [selected, setSelected] = useState<User | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

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
  useEffect(() => {
    setLayout({
      title: t('pages.user'),
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ],
      onCreate: toggle.open
    })
  }, [t, setLayout])

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
          columnDefs={regionUserColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </div>
      <RegionUserDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default RegionUserPage
