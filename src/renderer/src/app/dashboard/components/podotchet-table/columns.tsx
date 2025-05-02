import type { Dashboard } from '@/app/dashboard/model'
import type { CollapsibleColumnDef } from '@/common/components/collapsible-table'

import { t } from 'i18next'

import { formatNumber } from '@/common/lib/format'

export const podotchetColumns: CollapsibleColumnDef<Dashboard.Podotchet>[] = [
  {
    key: 'name'
  },
  {
    key: 'rayon'
  },
  {
    numeric: true,
    key: 'summa',
    className: 'w-72',
    renderCell(row) {
      return formatNumber(
        row?.budjets?.[0]?.main_schets.reduce((total, main_schet) => {
          const summa =
            main_schet?.jur4_schets?.reduce((total, schet) => {
              return total + (schet?.podotchet?.summa ?? 0)
            }, 0) ?? 0
          return total + summa
        }, 0)
      )
    }
  }
]

export const podotchetChildColumns: CollapsibleColumnDef<
  Dashboard.Podotchet['budjets'][number]['main_schets'][number]
>[] = [
  {
    key: 'account_number',
    renderCell(row) {
      return (
        <div className="flex flex-col">
          <span className="text-xs">{t('raschet-schet')}</span>
          <h6 className="font-bold">{row?.main_schet?.account_number}</h6>
        </div>
      )
    }
  },
  {
    numeric: true,
    key: 'podotchet.prixod',
    header: 'prixod',
    className: 'w-72',
    renderCell(row) {
      return formatNumber(
        row.jur4_schets.reduce((total, schet) => total + (schet?.podotchet?.summa ?? 0), 0)
      )
    }
  }
]
