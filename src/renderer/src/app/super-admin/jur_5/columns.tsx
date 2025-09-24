import type { AdminZarplataDocument } from './interfaces'
import type { ColumnDef } from '@/common/components'
import type { AdminZarplataDashboard, AdminZarplataMainSchet } from '@/common/models'

export const AdminZarplataDashboardColumnsDefs: ColumnDef<AdminZarplataDashboard>[] = [
  {
    key: 'regionName',
    header: 'region'
  },
  {
    numeric: true,
    className: 'font-black',
    key: 'uderjanieSum',
    header: 'uderjanie'
  }
]

export const AdminZarplataMainSchetColumnDefs: ColumnDef<AdminZarplataMainSchet>[] = [
  {
    key: 'budjetName',
    header: 'budjet'
  },
  {
    key: 'accountNumber',
    header: 'raschet-schet'
  },
  {
    key: 'schet'
  },
  {
    numeric: true,
    className: 'font-black',
    key: 'uderjanieSumma',
    header: 'uderjanie'
  }
]

export const AdminZarplataDocumentColumnDefs: ColumnDef<AdminZarplataDocument>[] = [
  {
    key: 'docNum',
    header: 'doc_num'
  },
  {
    key: 'docDate',
    header: 'doc_date'
  },
  {
    key: 'type'
  },
  {
    key: 'userFio',
    header: 'fio'
  },
  {
    key: 'userLogin',
    header: 'login'
  },
  {
    numeric: true,
    className: 'font-black',
    key: 'amount'
  }
]
