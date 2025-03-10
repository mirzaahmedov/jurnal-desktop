import type { OstatokGroup, OstatokProduct } from '@renderer/common/models/ostatok'

import { type ColumnDef, Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'
import { Trans } from 'react-i18next'

export const ostatokGroupColumns: ColumnDef<OstatokGroup>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160
  },
  {
    key: 'name',
    width: 600
  },
  {
    key: 'group_number'
  },
  {
    key: 'iznos_foiz',
    header: 'iznos'
  },
  {
    key: 'schet'
  },
  {
    key: 'provodka_debet',
    header: 'debet'
  },
  {
    key: 'iznos_foiz',
    header: 'kredit'
  },
  {
    key: 'iznos_foiz',
    header: 'subschet'
  }
]

export const ostatokProductColumns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name',
    className: 'min-w-[400px]',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.name}
        hoverContent={
          <DataList
            className="min-w-52"
            list={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.product.id}
                  >
                    #{row.product.id}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.product.name
              },
              {
                name: <Trans>ei</Trans>,
                value: `${row.product.edin}`
              },
              {
                name: <Trans>inventar-num</Trans>,
                value: row.product.inventar_num
              },
              {
                name: <Trans>serial-num</Trans>,
                value: row.product.serial_num
              }
            ]}
          />
        }
      />
    )
  },
  {
    key: 'edin',
    header: 'ei'
  },
  {
    key: 'responsible',
    header: 'responsible_short',
    className: 'min-w-[200px]',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.responsible.fio}
        secondaryText={<Copyable value={row.responsible.id}>#{row.responsible.id}</Copyable>}
        hoverContent={null}
      />
    )
  },
  {
    numeric: true,
    key: 'from.kol',
    header: 'Начало Кол.',
    renderCell: (row) => formatNumber(row.from.kol)
  },
  {
    numeric: true,
    key: 'from.summa',
    header: 'Начало Сумма',
    renderCell: (row) => formatNumber(row.from.summa)
  },
  {
    numeric: true,
    key: 'internal.prixod.kol',
    header: 'Приход Кол.',
    renderCell: (row) => formatNumber(row.internal?.kol_prixod)
  },
  {
    numeric: true,
    key: 'internal.prixod.summa',
    header: 'Приход Сумма',
    renderCell: (row) => formatNumber(row.internal?.summa_prixod)
  },
  {
    numeric: true,
    key: 'internal.rasxod.kol',
    header: 'Расход Кол.',
    renderCell: (row) => formatNumber(row.internal?.kol_rasxod)
  },
  {
    numeric: true,
    key: 'internal.rasxod.summa',
    header: 'Расход Сумма',
    renderCell: (row) => formatNumber(row.internal?.summa_rasxod)
  },
  {
    numeric: true,
    key: 'to.kol',
    header: 'Конец Кол.',
    renderCell: (row) => formatNumber(row.to.kol)
  },
  {
    numeric: true,
    key: 'to.summa',
    header: 'Конец Сумма',
    renderCell: (row) => formatNumber(row.to.summa)
  },
  {
    key: 'prixod_data.doc_date',
    header: 'Дата',
    renderCell: (row) => formatLocaleDate(row.prixod_data?.doc_date)
  }
]

export const ostatokSpravochnikColumns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'naimenovanie_tovarov_jur7_id',
    header: 'id',
    renderCell: IDCell
  },
  {
    key: 'name',
    width: 200,
    header: 'Наименование товара'
  },
  {
    key: 'sena',
    header: 'Цена',
    renderCell: (row) => row.to.sena
  },
  {
    key: 'to.kol',
    header: 'Кол-во',
    renderCell: (row) => row.to.kol
  },
  {
    key: 'to.summa',
    header: 'Сумма',
    renderCell: (row) => row.to.summa
  },
  {
    key: 'edin',
    header: 'Един.'
  },
  {
    key: 'group',
    header: 'Группа',
    renderCell: (row) => row.group.group_number
  },
  {
    key: 'prixod_data.data_pereotsenka',
    header: 'Дата переоценка',
    renderCell(row) {
      return formatLocaleDate(row.prixod_data?.doc_date)
    }
  }
]
