import type { ColumnDef } from '@/common/components'
import type { BankMonitoringType } from '@/common/models'

import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'

import { TooltipCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<BankMonitoringType>[] = [
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankMonitoringType] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'about-counteragent',
    className: 'w-96',
    renderCell(row) {
      return (
        <TooltipCell
          data={row}
          description="spravochnik_organization_inn"
          title={row.spravochnik_organization_name ?? '-'}
          elements={{
            spravochnik_organization_name: 'Наименование',
            spravochnik_organization_raschet_schet: 'Расчетный счет',
            spravochnik_organization_inn: 'ИНН'
          }}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'prixod_sum',
    header: 'prixod',
    renderCell(row) {
      return !row.prixod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.prixod_sum}
          schet={row.provodki_array?.[0]?.provodki_schet}
          sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'rasxod',
    renderCell(row) {
      return !row.rasxod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.rasxod_sum}
          schet={row.provodki_array?.[0]?.provodki_schet}
          sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
        />
      )
    }
  },
  {
    key: 'opisanie'
  },
  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell(row) {
      return `${row.fio} (@${row.login})`
    }
  }
]
