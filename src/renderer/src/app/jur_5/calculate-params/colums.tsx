import type { ColumnDef } from '@/common/components'
import type { CalculateParams } from '@/common/models/calculate-params'

import { Trans } from 'react-i18next'

import { MonthNameCell } from '@/common/components/table/renderers/month-name'
import { SelectCell } from '@/common/components/table/renderers/select'

export const columnDefs: ColumnDef<CalculateParams>[] = [
  {
    key: 'id',
    header: ' ',
    renderCell: SelectCell
  },

  {
    key: 'year'
  },
  {
    key: 'month',
    renderCell: (row) => <MonthNameCell monthNumber={row.month} />
  },
  {
    numeric: true,
    key: 'minZar',
    header: 'min_salary'
  },
  {
    numeric: true,
    key: 'mZpGod',
    header: 'min_salary_year'
  },
  {
    numeric: true,
    key: 'neobMin',
    header: 'min_salary_nontax'
  },
  {
    numeric: true,
    key: 'dni5',
    renderCell: (row) => row.dni5 ?? 0,
    renderHeader: () => (
      <>
        <Trans i18nKey="days" /> (5)
      </>
    )
  },
  {
    numeric: true,
    key: 'chasi5',
    renderCell: (row) => row.chasi5 ?? 0,
    renderHeader: () => (
      <>
        <Trans i18nKey="hours" /> (5)
      </>
    )
  },
  {
    numeric: true,
    key: 'dni6',
    renderCell: (row) => row.dni6 ?? 0,
    renderHeader: () => (
      <>
        <Trans i18nKey="days" /> (6)
      </>
    )
  },
  {
    numeric: true,
    key: 'chasi6',
    renderCell: (row) => row.chasi6 ?? 0,
    renderHeader: () => (
      <>
        <Trans i18nKey="hours" /> (6)
      </>
    )
  },
  {
    numeric: true,
    key: 'dni7',
    renderCell: (row) => row.dni7 ?? 0,
    renderHeader: () => (
      <>
        <Trans i18nKey="days" /> (7)
      </>
    )
  },
  {
    numeric: true,
    key: 'chasi7',
    renderCell: (row) => row.chasi7 ?? 0,
    renderHeader: () => (
      <>
        <Trans i18nKey="hours" /> (7)
      </>
    )
  },
  {
    numeric: true,
    key: 'vrach',
    header: 'doctor'
  },
  {
    numeric: true,
    key: 'medSes',
    header: 'nurse'
  },
  {
    numeric: true,
    key: 'zaProezd',
    header: 'for_ride'
  },
  {
    numeric: true,
    key: 'poek'
  },
  ...Array.from(
    { length: 5 },
    (_, i) =>
      ({
        numeric: true,
        key: `pr${i + 1}`,
        renderHeader: () => (
          <Trans
            i18nKey="pr_nth"
            values={{ nth: i + 1 }}
          />
        )
      }) as ColumnDef<CalculateParams>
  )
]
