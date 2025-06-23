import type { ColumnDef } from '@/common/components'
import type { MaterialPrixod } from '@/common/models'

// import { useTranslation } from 'react-i18next'

// import { ExpandableList } from '@/common/components/table/renderers/expandable-list'
import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const prixodColumns: ColumnDef<MaterialPrixod>[] = [
  {
    sort: true,
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    fill: true,
    minWidth: 350,
    key: 'kimdan_name',
    header: 'from-who'
  },
  {
    fill: true,
    minWidth: 350,
    key: 'kimga_name',
    header: 'to-whom'
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa',
    renderCell: (row) => <b className="font-black">{formatNumber(row.summa)}</b>
  },
  // {
  //   key: 'childs',
  //   header: 'provodka',
  //   minWidth: 560,
  //   renderCell: (row) => {
  //     return <ProvodkaCell row={row} />
  //   }
  // },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  },
  {
    fit: true,
    key: 'user_id',
    minWidth: 200,
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        id={row.user_id}
        fio={row.fio}
        login={row.login}
      />
    )
  }
]

// interface ProvodkaCellProps {
//   row: MaterialPrixod
// }
// const ProvodkaCell = ({ row }: ProvodkaCellProps) => {
//   const { t } = useTranslation()
//   return (
//     <ExpandableList
//       items={row.provodki_array}
//       renderHeader={() => (
//         <div className="w-full grid grid-cols-[repeat(4,1fr)] gap-2">
//           <b className="text-xs">
//             {t('debet')} {t('schet')}
//           </b>
//           <b className="text-xs">
//             {t('debet')} {t('subschet')}
//           </b>
//           <b className="text-xs">
//             {t('kredit')} {t('schet')}
//           </b>
//           <b className="text-xs">
//             {t('kredit')} {t('subschet')}
//           </b>
//         </div>
//       )}
//       renderItem={(item) => (
//         <div className="w-full grid grid-cols-[repeat(4,1fr)] gap-2">
//           <span className="text-xs">{item.debet_schet}</span>
//           <span className="text-xs">{item.debet_sub_schet}</span>
//           <span className="text-xs">{item.kredit_schet}</span>
//           <span className="text-xs">{item.kredit_sub_schet}</span>
//         </div>
//       )}
//     />
//   )
// }
