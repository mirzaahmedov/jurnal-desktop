import type { Smeta } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useConfirm } from '@/common/features/confirm'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { SmetaColumns } from './columns'
import { SmetaQueryKeys } from './config'
import { SmetaDialog } from './dialog'
import { SmetaFilters, useGroupNumberFilter } from './filter'
import { SmetaTable, smetaService } from './service'

const SmetaPage = () => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const [selected, setSelected] = useState<Smeta | null>(null)
  const [groupNumber] = useGroupNumberFilter()
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      SmetaQueryKeys.getAll,
      {
        page: 1,
        limit: 10000,
        group_number: groupNumber !== 'all' ? groupNumber : undefined,
        search
      }
    ],
    queryFn: smetaService.getAll
  })
  const { mutate: deleteSmeta, isPending } = useMutation({
    mutationKey: [SmetaQueryKeys.delete],
    mutationFn: smetaService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [SmetaQueryKeys.getAll]
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
      title: t('pages.smeta'),
      content: SmetaFilters,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: Smeta) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Smeta) => {
    confirm({
      onConfirm() {
        deleteSmeta(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        {SmetaTable ? (
          <SmetaTable
            data={mainSchets?.data ?? []}
            columnDefs={SmetaColumns}
            onEdit={handleClickEdit}
            onDelete={handleClickDelete}
          />
        ) : null}
      </ListView.Content>
      <SmetaDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default SmetaPage
