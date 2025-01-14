import { LoadingOverlay, SelectField } from '@renderer/common/components'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Smeta } from '@renderer/common/models'
import { SmetaDialog } from './dialog'
import { SmetaTable } from './service'
import { smetaColumns } from './columns'
import { smetaFilterOptions } from './group-filter'
import { smetaQueryKeys } from './config'
import { smetaService } from './service'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useToggle } from '@renderer/common/hooks/use-toggle'

const SmetaFilters = () => {
  const [groupNumber, setGroupNumber] = useQueryState(
    'group_number',
    parseAsString.withDefault('1')
  )

  return (
    <div className="flex gap-2 px-10">
      <SelectField
        name="group_number"
        value={groupNumber}
        onValueChange={setGroupNumber}
        options={smetaFilterOptions}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.value}
        placeholder="Guruhni tanlang"
      />
      <SearchField className="w-full" />
    </div>
  )
}
const SmetaPage = () => {
  const [selected, setSelected] = useState<Smeta | null>(null)
  const [groupNumber] = useQueryState('group_number', parseAsString.withDefault('1'))

  const { confirm } = useConfirm()
  const { search } = useSearch()

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      smetaQueryKeys.getAll,
      {
        page: 1,
        limit: 10000,
        group_number: groupNumber,
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
  useLayout({
    title: 'Смета',
    content: SmetaFilters,
    onCreate: toggle.open
  })

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
    <>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        {SmetaTable ? (
          <SmetaTable
            data={mainSchets?.data ?? []}
            columns={smetaColumns}
            onEdit={handleClickEdit}
            onDelete={handleClickDelete}
          />
        ) : null}
      </div>
      <SmetaDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default SmetaPage
