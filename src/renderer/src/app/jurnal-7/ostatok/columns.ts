import type { OstatokProduct } from '@renderer/common/models/ostatok'
import type { ColumnDef } from '@renderer/common/components'
import type { HeaderGroup } from '@renderer/common/components/generic-table/table'

import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'

export const ostatokColumns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'naimenovanie_tovarov_jur7_id',
    header: 'code'
  },
  {
    key: 'naimenovanie_tovarov',
    header: 'name'
  },
  {
    key: 'edin',
    header: 'ei'
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
    header: 'Дата прихода',
    renderCell: (row) => formatLocaleDate(row.prixod_data?.data_pereotsenka)
  }
]

export const ostatokHeaderGroups: HeaderGroup<OstatokProduct>[][] = [
  [
    {
      key: 'naimenovanie_tovarov_jur7_id',
      header: 'code',
      rowSpan: 2
    },
    {
      key: 'naimenovanie_tovarov',
      header: 'name',
      rowSpan: 2
    },
    {
      key: 'edin',
      header: 'ei',
      rowSpan: 2
    },
    {
      key: 'from',
      header: 'start',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'internal.prixod',
      header: 'prixod',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'internal.rasxod',
      header: 'rasxod',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'to',
      header: 'end',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'prixod_data',
      rowSpan: 2,
      header: 'data-prixod'
    }
  ],
  [
    {
      numeric: true,
      key: 'from.kol',
      header: 'kol'
    },
    {
      numeric: true,
      key: 'from.summa',
      header: 'summa'
    },
    {
      numeric: true,
      key: 'internal.prixod.kol',
      header: 'kol'
    },
    {
      numeric: true,
      key: 'internal.prixod.summa',
      header: 'summa'
    },
    {
      numeric: true,
      key: 'internal.rasxod.kol',
      header: 'kol'
    },
    {
      numeric: true,
      key: 'internal.rasxod.summa',
      header: 'summa'
    },
    {
      numeric: true,
      key: 'to.kol',
      header: 'kol'
    },
    {
      numeric: true,
      key: 'to.summa',
      header: 'summa',
      headerClassName: 'last:border-solid'
    }
  ]
]

export const ostatokProductColumns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'naimenovanie_tovarov_jur7_id',
    header: 'Код товара'
  },
  {
    key: 'naimenovanie_tovarov',
    header: 'Наименование товара'
  },
  {
    key: 'sena',
    header: 'Цена'
  },
  {
    key: 'to.kol',
    header: 'Кол-во',
    renderCell(row) {
      return row.to.kol
    }
  },
  {
    key: 'to.summa',
    header: 'Сумма',
    renderCell(row) {
      return row.to.summa
    }
  },
  {
    key: 'edin',
    header: 'Един.'
  },
  {
    key: 'group_name',
    header: 'Группа'
  },
  {
    key: 'date_saldo',
    header: 'Дата сальдо',
    renderCell(row) {
      return formatLocaleDate(row.date_saldo)
    }
  },
  {
    key: 'prixod_data.data_pereotsenka',
    header: 'Дата переоценка',
    renderCell(row) {
      return formatLocaleDate(row.prixod_data?.data_pereotsenka)
    }
  }
]
