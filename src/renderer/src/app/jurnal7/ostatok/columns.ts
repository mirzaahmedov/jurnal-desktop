import type { Ostatok, OstatokProduct } from '@renderer/common/models/ostatok'

import type { ColumnDef } from '@renderer/common/components'

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
    key: 'from.kol',
    header: 'Начало Кол.',
    renderCell: (row) => row.from.kol
  },
  {
    key: 'from.summa',
    header: 'Начало Сумма',
    renderCell: (row) => row.from.summa
  },
  {
    key: 'internal.prixod.kol',
    header: 'Приход Кол.',
    renderCell: (row) => row.internal.prixod.kol
  },
  {
    key: 'internal.prixod.summa',
    header: 'Приход Сумма',
    renderCell: (row) => row.internal.prixod.summa
  },
  {
    key: 'internal.rasxod.kol',
    header: 'Расход Кол.',
    renderCell: (row) => row.internal.rasxod.kol
  },
  {
    key: 'internal.rasxod.summa',
    header: 'Расход Сумма',
    renderCell: (row) => row.internal.rasxod.summa
  },
  {
    key: 'to.kol',
    header: 'Конец Кол.',
    renderCell: (row) => row.to.kol
  },
  {
    key: 'to.summa',
    header: 'Конец Сумма',
    renderCell: (row) => row.to.summa
  }
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
    header: 'Дата'
  }
]
