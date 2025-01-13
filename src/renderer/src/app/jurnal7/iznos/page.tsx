import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination, useToggle } from '@renderer/common/hooks'

import { EditIznosDialog } from './edit-dialog'
import { GenericTable } from '@renderer/common/components'
import { Iznos } from '@renderer/common/models'
import { ListView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { columns } from './columns'
import { getFirstDayOfMonth } from '@renderer/common/lib/date'
import { iznosQueryKeys } from './config'
import { iznosService } from './service'
import { useLayout } from '@renderer/common/features/layout'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

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
    title: 'Износ'
  })

  const handleEdit = (row: Iznos) => {
    setSelected(row)
    dialogToggle.open()
  }

  return (
    <ListView>
      <ListView.Header>
        <div className="flex items-center">
          <SearchField className="px-0 w-full max-w-sm justify-start [&>input]:w-full" />
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
      <ListView.Content loading={isFetching}>
        <GenericTable
          columns={columns}
          data={iznosList?.data ?? []}
          onEdit={handleEdit}
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
