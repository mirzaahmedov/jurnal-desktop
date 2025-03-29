import type { ColumnDef } from '@/common/components'
import type {
  Nachislenie,
  Uderjanie,
  UderjanieAliment,
  UderjanieDopOplataProvodka,
  UderjanieNachislenieProvodka,
  UderjanieProvodka
} from '@/common/models'

import { IDCell } from '@/common/components/table/renderers/id'
import { MonthNameCell } from '@/common/components/table/renderers/month-name'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const nachieslenieColumns: ColumnDef<Nachislenie>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    minWidth: 100
  },
  {
    fit: true,
    key: 'tabelDocNum',
    header: 'doc_num'
  },
  {
    key: 'tableDocDate',
    header: 'date',
    width: 80,
    minWidth: 80,
    renderCell: (row) => formatLocaleDate(row.docDate)
  },
  {
    key: 'typeVedomost',
    header: 'type',
    minWidth: 120
  },
  {
    key: 'fio',
    minWidth: 250
  },
  {
    key: 'description',
    header: 'opisanie',
    width: 250,
    minWidth: 250
  },
  {
    key: 'doljnostName',
    header: 'doljnost',
    minWidth: 150
  },
  {
    key: 'zvanieName',
    header: 'zvanie',
    minWidth: 150
  },
  {
    fit: true,
    key: 'kartochka'
  },
  {
    key: 'nachislenieYear',
    header: 'year'
  },
  {
    key: 'nachislenieMonth',
    header: 'month',
    renderCell: (row) => <MonthNameCell monthNumber={row.nachislenieMonth} />
  }
]

export const uderjanieColumns: ColumnDef<Uderjanie>[] = [
  {
    key: 'fio',
    width: 300,
    minWidth: 300
  },
  {
    key: 'rayon',
    width: 400,
    minWidth: 400,
    className: 'text-xs'
  },
  {
    key: 'doljnostName',
    width: 300,
    minWidth: 300,
    header: 'doljnost'
  },
  {
    numeric: true,
    key: 'dopOplataSumma',
    header: 'doplata',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.dopOplataSumma)
  },
  {
    numeric: true,
    key: 'nachislenieSumma',
    header: 'nachislenie',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.dopOplataSumma)
  },
  {
    numeric: true,
    key: 'uderjanieSumma',
    header: 'uderjanie',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.dopOplataSumma)
  },
  {
    numeric: true,
    key: 'naRuki',
    header: 'na_ruki',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.naRuki)
  },
  {
    numeric: true,
    key: 'kartochka',
    width: 300,
    minWidth: 300,
    renderCell: (row) => formatNumber(row.kartochka ? Number(row.kartochka) : 0)
  }
]

export const uderjanieNachislenieProvodkaColumns: ColumnDef<UderjanieNachislenieProvodka>[] = [
  {
    key: 'name'
  },
  {
    key: 'foiz'
  },
  {
    numeric: true,
    key: 'summa',
    renderCell: (row) => formatNumber(row.summa ? Number(row.summa) : 0)
  },
  {
    key: 'type_code',
    header: 'type'
  }
]

export const uderjanieProvodkaColumns: ColumnDef<UderjanieProvodka>[] = [
  {
    key: 'name'
  },
  {
    key: 'nimaning_uderjaniyasi',
    header: 'opisanie'
  },
  {
    key: 'razmer'
  },
  {
    numeric: true,
    key: 'summa',
    renderCell: (row) => formatNumber(row.summa ? Number(row.summa) : 0)
  },
  {
    key: 'vid_uder',
    header: 'vid_uderjanie'
  },
  {
    key: 'types_type_code',
    header: 'type'
  }
]

export const uderjanieDopOplataProvodkaColumns: ColumnDef<UderjanieDopOplataProvodka>[] = [
  {
    key: 'name'
  },
  {
    key: 'razmer'
  },
  {
    key: 'summa'
  },
  {
    key: 'vid_uder',
    header: 'vid_uderjanie'
  },
  {
    key: 'types_name',
    header: 'type'
  }
]

export const uderjanieAlimentColumns: ColumnDef<UderjanieAliment>[] = [
  {
    key: 'opisanie'
  },
  {
    numeric: true,
    key: 'summa',
    minWidth: 200
  }
]
