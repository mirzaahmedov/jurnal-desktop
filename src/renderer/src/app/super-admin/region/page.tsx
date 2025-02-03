import type { Region } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { regionColumns } from './columns'
import { regionQueryKeys } from './constants'
import RegionsDialog from './dialog'
import { regionService } from './service'

const RegionPage = () => {
  const [selected, setSelected] = useState<Region | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: region, isFetching } = useQuery({
    queryKey: [regionQueryKeys.getAll],
    queryFn: regionService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [regionQueryKeys.delete],
    mutationFn: regionService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [regionQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: t('pages.region'),
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Region) => {
    setSelected(row)
    toggle.open()
  }

  const handleClickDelete = (row: Region) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={region?.data ?? []}
          columnDefs={regionColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>

      <RegionsDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default RegionPage
