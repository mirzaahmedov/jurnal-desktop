import type { ColumnDef } from '@/common/components'
import type { Zarplata } from '@/common/models'

import { Checkbox } from '@/common/components/jolly/checkbox'
import { IDCell } from '@/common/components/table/renderers/id'

import { ZarplataSpravochnikType } from './config'

export const ZarplataSpravochnikColumnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'typeCode',
    header: 'type_code',
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    key: 'schet'
  },
  {
    key: 'subSchet',
    header: 'subschet'
  },
  {
    numeric: true,
    key: 'sena1',
    header: 'sena_1'
  },
  {
    numeric: true,
    key: 'sena2',
    header: 'sena_2'
  }
]

export const ZarplataSpravochnikDoljnostColumnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'typeCode',
    header: 'type_code',
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    key: 'isPoek',
    header: 'poek',
    renderCell: (row) => (
      <Checkbox
        isReadOnly
        isSelected={row.isPoek}
      />
    )
  }
]
export const ZarplataSpravochnikZvanieColumnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'typeCode',
    header: 'type_code',
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    numeric: true,
    key: 'sena1',
    header: 'sena_1'
  },
  {
    numeric: true,
    key: 'sena2',
    header: 'sena_2'
  }
]

export const ZarplataSpravochnikDialogColumnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  }
]

export const getZarplataSpravochnikColumnDefs = (
  typeCode: ZarplataSpravochnikType
): ColumnDef<Zarplata.Spravochnik>[] => {
  switch (typeCode) {
    case ZarplataSpravochnikType.Doljnost:
      return ZarplataSpravochnikDoljnostColumnDefs
    default:
      return ZarplataSpravochnikZvanieColumnDefs
  }
}
export const getZarplataSpravochnikDialogColumnDefs = (
  typeCode: ZarplataSpravochnikType
): ColumnDef<Zarplata.Spravochnik>[] => {
  switch (typeCode) {
    case ZarplataSpravochnikType.Doljnost:
      return ZarplataSpravochnikDoljnostColumnDefs
    case ZarplataSpravochnikType.Zvanie:
      return ZarplataSpravochnikZvanieColumnDefs
    default:
      return ZarplataSpravochnikDialogColumnDefs
  }
}
