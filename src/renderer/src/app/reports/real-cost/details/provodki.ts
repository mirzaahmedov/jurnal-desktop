import type { ColumnDef } from '@/common/components'
import type { CollapsibleColumnDef } from '@/common/components/collapsible-table'
import type { RealCostProvodka, RealCostShartnomaGrafik } from '@/common/models'

export const RealCostProvodkaColumns: CollapsibleColumnDef<RealCostProvodka>[] = [
  {
    key: 'smeta_name',
    header: 'name',
    minWidth: 300
  },
  {
    key: 'smeta_number',
    minWidth: 100
  },
  {
    numeric: true,
    key: 'month_summa',
    header: 'month'
  },
  {
    numeric: true,
    key: 'year_summa',
    header: 'year'
  }
]

export const RealCostGrafikColumns: ColumnDef<RealCostShartnomaGrafik>[] = [
  {
    key: 'doc_num',
    header: 'name',
    minWidth: 300
  },
  {
    key: 'doc_date',
    minWidth: 100,
    headerClassName: 'sticky left-0 z-50',
    className: 'font-bold sticky left-0 z-10'
  },
  {
    key: ''
  }
]
