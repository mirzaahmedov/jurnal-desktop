import type { Smeta } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { SelectField } from '@renderer/common/components'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayoutStore } from '@renderer/common/features/layout'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { useToggle } from '@renderer/common/hooks/use-toggle'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { smetaColumns } from './columns'
import { smetaQueryKeys } from './config'
import { SmetaDialog } from './dialog'
import { smetaFilterOptions } from './group-filter'
import { SmetaTable, smetaService } from './service'

const SmetaFilters = () => {
  const [groupNumber, setGroupNumber] = useLocationState('group_number', 'all')

  const { t } = useTranslation()

  return (
    <div className="flex gap-2 px-10">
      <SelectField
        name="group_number"
        value={groupNumber}
        onValueChange={setGroupNumber}
        options={smetaFilterOptions}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.value}
        placeholder={t('choose', { what: t('group') })}
      />
      <SearchField className="w-full" />
    </div>
  )
}
const SmetaPage = () => {
  const toggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const [selected, setSelected] = useState<Smeta | null>(null)
  const [groupNumber] = useLocationState('group_number', 'all')

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

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
