import type { Ostatok, OstatokProduct } from '@renderer/common/models/ostatok'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'

import type { ColumnDef } from '@renderer/common/components'
import { HeaderGroup } from '@renderer/common/components/generic-table/table'

export const ostatokColumns: ColumnDef<Ostatok>[] = [
  {
    key: 'naimenovanie_tovarov_jur7_id',
    header: 'Код товара'
  },
  {
    key: 'naimenovanie_tovarov',
    header: 'Наименование товара'
  },
  {
    key: 'edin',
    header: 'Един.'
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
    renderCell: (row) => formatNumber(row.internal.prixod.kol)
  },
  {
    numeric: true,
    key: 'internal.prixod.summa',
    header: 'Приход Сумма',
    renderCell: (row) => formatNumber(row.internal.prixod.summa)
  },
  {
    numeric: true,
    key: 'internal.rasxod.kol',
    header: 'Расход Кол.',
    renderCell: (row) => formatNumber(row.internal.rasxod.kol)
  },
  {
    numeric: true,
    key: 'internal.rasxod.summa',
    header: 'Расход Сумма',
    renderCell: (row) => formatNumber(row.internal.rasxod.summa)
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
    renderCell: (row) => formatLocaleDate(row.prixod_data?.doc_date)
  }
]

export const ostatokHeaderGroups: HeaderGroup<Ostatok>[][] = [
  [
    {
      key: 'naimenovanie_tovarov_jur7_id',
      header: 'Код товара',
      rowSpan: 2
    },
    {
      key: 'naimenovanie_tovarov',
      header: 'Наименование товара',
      rowSpan: 2
    },
    {
      key: 'edin',
      header: 'Един.',
      rowSpan: 2
    },
    {
      key: 'from',
      header: 'Начало',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'internal.prixod',
      header: 'Приход',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'internal.rasxod',
      header: 'Расход',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'to',
      header: 'Конец',
      colSpan: 2,
      headerClassName: 'text-center'
    },
    {
      key: 'prixod_data',
      rowSpan: 2,
      header: 'Дата прихода'
    }
  ],
  [
    {
      numeric: true,
      key: 'from.kol',
      header: 'Кол.'
    },
    {
      numeric: true,
      key: 'from.summa',
      header: 'Сумма'
    },
    {
      numeric: true,
      key: 'internal.prixod.kol',
      header: 'Кол.'
    },
    {
      numeric: true,
      key: 'internal.prixod.summa',
      header: 'Сумма'
    },
    {
      numeric: true,
      key: 'internal.rasxod.kol',
      header: 'Кол.'
    },
    {
      numeric: true,
      key: 'internal.rasxod.summa',
      header: 'Сумма'
    },
    {
      numeric: true,
      key: 'to.kol',
      header: 'Кол.'
    },
    {
      numeric: true,
      key: 'to.summa',
      header: 'Сумма',
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
    key: 'group_jur7_name',
    header: 'Группа'
  },
  {
    key: 'prixod_doc_date',
    header: 'Дата сальдо'
  }
]
