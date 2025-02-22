import type { Region } from '@/common/models'

import { useEffect, useState } from 'react'

import { SearchField, useSearch } from '@renderer/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { regionColumns } from './columns'
import { regionQueryKeys } from './constants'
import RegionsDialog from './dialog'
import { regionService } from './service'

const RegionPage = () => {
  const [selected, setSelected] = useState<Region | null>(null)

  const setLayout = useLayoutStore((store) => store.setLayout)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { confirm } = useConfirm()

  const { data: region, isFetching } = useQuery({
    queryKey: [regionQueryKeys.getAll, { search }],
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
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.region'),
      content: SearchField,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t])

  const handleClickEdit = (row: Region) => {
    setSelected(row)
    dialogToggle.open()
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
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </>
  )
}

export default RegionPage
