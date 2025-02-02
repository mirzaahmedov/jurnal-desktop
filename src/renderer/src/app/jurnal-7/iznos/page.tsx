import { useState } from 'react'

import { GenericTable } from '@renderer/common/components'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { useLayout } from '@renderer/common/features/layout'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { getFirstDayOfMonth } from '@renderer/common/lib/date'
import { Iznos } from '@renderer/common/models'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'

import { columns } from './columns'
import { iznosQueryKeys } from './config'
import { EditIznosDialog } from './edit-dialog'
import { iznosService } from './service'

const IznosPage = () => {
  const date = getFirstDayOfMonth()
  const pagination = usePagination()
  const dialogToggle = useToggle()

  const [year, setYear] = useState<number>(date.getFullYear())
  const [month, setMonth] = useState<number>(date.getMonth() + 1)
  const [selected, setSelected] = useState<Iznos | null>(null)

  const { search } = useSearch()

  const { data: iznosList, isFetching } = useQuery({
    queryKey: [
      iznosQueryKeys.getAll,
      {
        month: month || undefined,
        year: year || undefined,
        search: search || undefined,
        ...pagination
      }
    ],
    queryFn: iznosService.getAll
  })

  useLayout({
    title: 'Износ',
    content: SearchField
  })

  const handleEdit = (row: Iznos) => {
    setSelected(row)
    dialogToggle.open()
  }

  return (
    <ListView>
      <ListView.Header>
        <div className="flex items-center">
          <MonthPicker
            value={year && month ? `${year}-${month}-01` : ''}
            onChange={(date) => {
              const [year, month] = date?.split('-')?.map(Number) ?? []
              setYear(year)
              setMonth(month)
            }}
          />
        </div>
      </ListView.Header>
      <ListView.Content
        loading={isFetching}
        className="relative overflow-auto scrollbar"
      >
        <GenericTable
          columnDefs={columns}
          data={iznosList?.data ?? []}
          onEdit={handleEdit}
          className="overflow-hidden w-full whitespace-nowrap"
        />
        <EditIznosDialog
          selected={selected}
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={iznosList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default IznosPage
