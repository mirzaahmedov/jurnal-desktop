import type { MaterialSaldoProduct } from '@/common/models/saldo'
import type { TFunction } from 'i18next'

import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { ExpandableList } from '@/common/components/table/renderers/expandable-list'
import { UserCell } from '@/common/components/table/renderers/user'
import { Badge } from '@/common/components/ui/badge'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const CommonMaterialSaldoProductColumns: (
  t: TFunction,
  options?: {
    includeIznosPrixod?: boolean
    includeIznosRasxod?: boolean
  }
) => ColumnDef<MaterialSaldoProduct>[] = (t: TFunction, options = {}) => {
  return [
    {
      key: 'name',
      minWidth: 400,
      renderCell: (row, _, props) => (
        <HoverInfoCell
          onClick={() =>
            typeof props.params?.onClickTitle === 'function'
              ? props.params?.onClickTitle(row)
              : undefined
          }
          title={<span className="text-xs hover:text-brand transition-colors">{row.name}</span>}
          tooltipProps={{
            placement: 'right'
          }}
          tooltipContent={
            <DataList
              className="min-w-52"
              items={[
                {
                  name: <Trans>id</Trans>,
                  value: (
                    <Copyable
                      side="start"
                      value={row.name}
                    >
                      #{row.product_id}
                    </Copyable>
                  )
                },
                {
                  name: <Trans>name</Trans>,
                  value: row.name
                },
                {
                  name: <Trans>ei</Trans>,
                  value: `${row.edin}`
                },
                {
                  name: <Trans>inventar-num</Trans>,
                  value: row.inventar_num
                },
                {
                  name: <Trans>serial-num</Trans>,
                  value: row.serial_num
                }
              ]}
            />
          }
        />
      )
    },
    {
      key: 'edin',
      header: 'ei',
      minWidth: 100
    },
    {
      key: 'responsible',
      header: 'responsible_short',
      minWidth: 200,
      renderCell: (row) => (
        <HoverInfoCell
          title={row.fio}
          secondaryText={<Copyable value={row.responsible_id}>#{row.responsible_id}</Copyable>}
          tooltipContent={null}
        />
      )
    },
    {
      key: 'group_id',
      header: 'group',
      minWidth: 260,
      renderCell: (row) => (
        <HoverInfoCell
          title={<span className="text-xs line-clamp-3">{row.group_name}</span>}
          tooltipContent={
            <DataList
              items={[
                {
                  name: <Trans>id</Trans>,
                  value: <Copyable value={row.group_id}>#{row.group_id}</Copyable>
                },
                {
                  name: <Trans>name</Trans>,
                  value: row.group_name
                },
                {
                  name: <Trans>number</Trans>,
                  value: row.group_number
                }
              ]}
            />
          }
        />
      )
    },
    {
      key: 'type',
      renderCell: (row) => (
        <Badge>
          <Trans>{row.type}</Trans>
        </Badge>
      )
    },
    {
      key: 'debet_schet',
      header: 'schet'
    },
    {
      numeric: true,
      key: 'from.kol',
      header: `${t('start_short')} ${t('kol')}`,
      renderCell: (row) => row.from?.kol
    },
    {
      numeric: true,
      key: 'from.summa',
      header: `${t('start_short')} ${t('summa')}`,
      renderCell: (row) => formatNumber(row.from?.summa)
    },
    {
      numeric: true,
      key: 'internal.prixod.kol',
      header: `${t('prixod')} ${t('kol')}`,
      renderCell: (row) => row.internal?.prixod_kol
    },
    {
      numeric: true,
      key: 'internal.prixod.summa',
      header: `${t('prixod')} ${t('summa')}`,
      renderCell: (row) => formatNumber(row.internal?.prixod_summa)
    },
    {
      numeric: true,
      key: 'internal.rasxod.kol',
      header: `${t('rasxod')} ${t('kol')}`,
      renderCell: (row) => row.internal?.rasxod_kol
    },
    {
      numeric: true,
      key: 'internal.rasxod.summa',
      header: `${t('rasxod')} ${t('summa')}`,
      renderCell: (row) => formatNumber(row.internal?.rasxod_summa)
    },
    {
      numeric: true,
      key: 'to.kol',
      header: `${t('end')} ${t('kol')}`,
      renderCell: (row) => row.to?.kol
    },
    {
      numeric: true,
      key: 'to.sena',
      header: `${t('end')} ${t('sena')}`,
      renderCell: (row) => formatNumber(row.to?.sena)
    },
    {
      numeric: true,
      key: 'to.summa',
      header: `${t('end')} ${t('summa')}`,
      renderCell: (row) => formatNumber(row.to?.summa)
    },
    {
      fit: true,
      key: 'iznos_schet',
      header: 'schet'
    },
    {
      fit: true,
      key: 'iznos_sub_schet',
      header: 'subschet'
    },
    {
      fit: true,
      key: 'iznos_start_date',
      header: 'iznos_start_date',
      renderCell: (row) => formatLocaleDate(row.iznos_start)
    },
    {
      numeric: true,
      key: 'eski_iznos_summa',
      header: 'iznos_summa_old',
      renderCell: (row) => formatNumber(row.from.iznos_summa)
    },
    options.includeIznosPrixod
      ? {
          numeric: true,
          key: 'internal.prixod_iznos_summa',
          header: `${t('iznos')} (${t('prixod')})`,
          renderCell: (row) => formatNumber(row.internal.prixod_iznos_summa ?? 0)
        }
      : null,
    options.includeIznosRasxod
      ? {
          numeric: true,
          key: 'internal.rasxod_iznos_summa',
          header: `${t('iznos')} (${t('rasxod')})`,
          renderCell: (row) => formatNumber(row.internal.rasxod_iznos_summa ?? 0)
        }
      : null,
    {
      numeric: true,
      key: 'iznos_summa_bir_oylik',
      header: 'iznos_summa_month',
      renderCell: (row) => formatNumber(row.to.month_iznos ?? 0)
    },
    {
      numeric: true,
      key: 'iznos_summa',
      header: 'iznos_summa_total',
      renderCell: (row) => formatNumber(row.to.iznos_summa ?? 0)
    },
    {
      key: 'prixodData',
      header: 'prixod',
      renderCell: (row: MaterialSaldoProduct) => (
        <ExpandableList
          items={row.prixodData}
          renderItem={(prixod) => (
            <div className="flex items-center">
              <Copyable value={prixod.docNum}>№{prixod.docNum}</Copyable>
              <Copyable value={prixod.docDate}>{formatLocaleDate(prixod.docDate)}</Copyable>
            </div>
          )}
        />
      )
    },
    {
      fit: true,
      key: 'user_id',
      minWidth: 200,
      header: 'created-by-user',
      renderCell: (row) => (
        <UserCell
          id={row.user_id}
          fio={row.fio}
          login={row.login}
        />
      )
    }
  ].filter(Boolean) as ColumnDef<MaterialSaldoProduct>[]
}
