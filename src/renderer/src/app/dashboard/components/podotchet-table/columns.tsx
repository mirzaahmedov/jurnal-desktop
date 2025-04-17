import type { Dashboard } from '../../model'
import type { ColumnDef } from '@/common/components'

import { t } from 'i18next'

import { formatNumber } from '@/common/lib/format'

export const normalizePodotchetData = (podotchets?: Dashboard.Podotchet[]) =>
  podotchets?.map((podotchet) => {
    return {
      id: podotchet.id,
      name: podotchet.name,
      rayon: podotchet.rayon,
      children: podotchet.budjets[0].main_schets
    }
  }) ?? []

export type PodochetTableRow = ReturnType<typeof normalizePodotchetData>[number]

export const podotchetColumns: ColumnDef<PodochetTableRow>[] = [
  {
    key: 'name'
  },
  {
    key: 'rayon'
  },
  {
    numeric: true,
    key: 'prixod',
    className: 'w-72',
    renderCell(row) {
      return formatNumber(
        row?.children?.reduce((total, schet) => {
          return total + (schet?.podotchet?.prixod_sum ?? 0)
        }, 0)
      )
    }
  },
  {
    numeric: true,
    key: 'rasxod',
    className: 'w-72',
    renderCell(row) {
      return formatNumber(
        row?.children?.reduce((total, schet) => {
          return total + (schet?.podotchet?.rasxod_sum ?? 0)
        }, 0)
      )
    }
  }
]

export const podotchetChildColumns: ColumnDef<PodochetTableRow['children'][number]>[] = [
  {
    key: 'account_number',
    renderCell(row) {
      return (
        <div className="flex flex-col">
          <span className="text-xs">{t('raschet-schet')}</span>
          <h6 className="font-bold">{row.account_number}</h6>
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
      return formatNumber(row.podotchet.prixod_sum)
    }
  },
  {
    numeric: true,
    key: 'podotchet.rasxod',
    header: 'rasxod',
    className: 'w-72',
    renderCell(row) {
      return formatNumber(row.podotchet.rasxod_sum)
    }
  }
]
