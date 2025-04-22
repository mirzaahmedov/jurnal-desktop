import type { Region } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'

import { RegionColumns } from './columns'
import { RegionQueryKeys } from './config'
import { RegionDialog } from './dialog'
import { RegionService } from './service'

const RegionPage = () => {
  const setLayout = useLayout()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<Region | null>(null)
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: regions, isFetching } = useQuery({
    queryKey: [RegionQueryKeys.getAll, { search }],
    queryFn: RegionService.getAll
  })
  const { mutate: deleteRegion, isPending } = useMutation({
    mutationKey: [RegionQueryKeys.delete],
    mutationFn: RegionService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [RegionQueryKeys.getAll]
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
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: Region) => {
    setSelected(row)
    dialogToggle.open()
  }

  const handleClickDelete = (row: Region) => {
    confirm({
      onConfirm() {
        deleteRegion(row.id)
      }
    })
  }

  return (
    <>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={RegionColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>

      <RegionDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </>
  )
}

export default RegionPage
