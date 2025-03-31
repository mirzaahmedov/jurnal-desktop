import type { Smeta } from '@/common/models'

import { useEffect, useState } from 'react'

import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'
import { ListView } from '@/common/views'

import { smetaColumns } from './columns'
import { smetaQueryKeys } from './config'
import { SmetaDialog } from './dialog'
import { SmetaFilters, useGroupNumberFilter } from './filter'
import { SmetaTable, smetaService } from './service'

const SmetaPage = () => {
  const toggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const [selected, setSelected] = useState<Smeta | null>(null)
  const [groupNumber] = useGroupNumberFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const [search] = useSearchFilter()

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      smetaQueryKeys.getAll,
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
    mutationKey: [smetaQueryKeys.delete],
    mutationFn: smetaService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [smetaQueryKeys.getAll]
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
      title: t('pages.smeta'),
      content: SmetaFilters,
      onCreate: toggle.open
    })
  }, [setLayout])

  const handleClickEdit = (row: Smeta) => {
    setSelected(row)
    toggle.open()
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
      <ListView.Content loading={isFetching || isPending}>
        {SmetaTable ? (
          <SmetaTable
            data={mainSchets?.data ?? []}
            columnDefs={smetaColumns}
            onEdit={handleClickEdit}
            onDelete={handleClickDelete}
          />
        ) : null}
      </ListView.Content>
      <SmetaDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </ListView>
  )
}

export default SmetaPage
