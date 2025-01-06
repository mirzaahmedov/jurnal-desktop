import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { Mainbook } from '@renderer/common/models'
import { adminMainBookService } from './service'
import { columns } from './columns'
import { queryKeys } from './config'
import { useLayout } from '@renderer/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

// import { parseAsInteger, useQueryState } from 'nuqs'

// import { createBudgetSpravochnik } from '../budjet'

// import { useSpravochnik } from '@renderer/common/features/spravochnik'

const AdminMainbookPage = () => {
  const navigate = useNavigate()

  const { data: reports, isFetching } = useQuery({
    queryKey: [queryKeys.getAll],
    queryFn: adminMainBookService.getAll
  })

  const handleEdit = (row: Mainbook.AdminReport) => {
    navigate(
      `info?region_id=${row.region_id}&date=${row.year}-${row.month}&budjet_id=${row.budjet_id}`
    )
  }

  useLayout({
    title: 'Главная книга'
  })

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columns={columns}
          data={reports?.data ?? []}
          onEdit={handleEdit}
        />
      </ListView.Content>
    </ListView>
  )
}

// const BudjetFilter = () => {
//   const [budjet, setBudjet] = useQueryState('budjet_id', parseAsInteger)
//   const budjetSpravochnik = useSpravochnik(
//     createBudgetSpravochnik({
//       value: budjet ?? 0,
//       onChange(value) {
//         setBudjet(value)
//       }
//     })
//   )
//   return (
//     <div className="px-5 max-w-xs">
//       <SpravochnikInput
//         value={budjetSpravochnik.selected?.name ?? ''}
//         onClear={budjetSpravochnik.clear}
//         onDoubleClick={budjetSpravochnik.open}
//       />
//     </div>
//   )
// }

export default AdminMainbookPage
