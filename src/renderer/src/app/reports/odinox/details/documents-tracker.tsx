import type { GetDocsArgs } from '../service'
import type { ColumnDef } from '@/common/components'
import type {
  OdinoxDocument,
  OdinoxGrafik,
  OdinoxRasxod,
  OdinoxRemaining,
  SmetaGrafik
} from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { Trans } from 'react-i18next'

import { EmptyFolder } from '@/common/assets/illustrations/empty-folder'
import { GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { ProvodkaBadge } from '@/common/components/provodka-badge'
import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { getMonthName } from '@/common/lib/date'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

import { OdinoxTableRow } from './interfaces'

export interface OdinoxDocumentsTrackerProps extends Omit<DialogTriggerProps, 'children'> {
  args?: GetDocsArgs
  docs: OdinoxDocument[]
  onClose: VoidFunction
}

const isSmetaGrafik = (_values: unknown, sort_order: number): _values is OdinoxGrafik[] => {
  return sort_order === 0 || sort_order === 5
}

const isRemaining = (_values: unknown, sort_order: number): _values is OdinoxRemaining[] => {
  return sort_order === 4 || sort_order === 9
}

export const OdinoxDocumentsTracker = ({ args, docs, onClose }: OdinoxDocumentsTrackerProps) => {
  return (
    <DialogTrigger
      isOpen={!!args}
      onOpenChange={onClose}
    >
      <DialogOverlay>
        <DialogContent className="w-full max-w-[1800px] h-full max-h-[900px] flex flex-col p-0 gap-0 overflow-hidden">
          <div className="w-full flex flex-col">
            <DialogHeader className="p-5">
              <DialogTitle>
                <Trans ns="app">
                  {!args
                    ? null
                    : args?.sort_order === 0 || args?.sort_order === 5
                      ? 'pages.smeta_grafik'
                      : (args?.sort_order > 0 && args?.sort_order < 4) ||
                          (args?.sort_order > 6 && args?.sort_order < 10)
                        ? 'pages.documents'
                        : 'remainder'}
                </Trans>
              </DialogTitle>
            </DialogHeader>
            <div className="w-full max-w-[1800px] flex-1 overflow-x-auto scrollbar">
              {!args ? null : isSmetaGrafik(docs, args?.sort_order) ? (
                (docs.map((row) => row.smeta_grafik).filter((v) => !!v) ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-10">
                    <EmptyFolder className="h-96" />
                    <h6 className="font-medium text-slate-500">
                      <Trans>no_smeta_grafiks_for_this_smeta</Trans>
                    </h6>
                  </div>
                ) : (
                  <GenericTable
                    data={docs.map((row) => row.smeta_grafik).filter((v) => !!v) ?? []}
                    columnDefs={getSmetaGrafikColumns(
                      args.sort_order === 0
                        ? [args.month]
                        : args.sort_order === 5
                          ? Array.from({ length: args.month }).map((_, i) => i + 1)
                          : []
                    )}
                  />
                )
              ) : isRemaining(docs, args.sort_order) ? (
                <GenericTable
                  data={
                    (docs as OdinoxRemaining[])
                      .map(
                        (row) =>
                          ({
                            allocated_funds: formatNumber(row.grafik_data.summa),
                            funds_paid_by_ministry: '-',
                            kassa_rasxod_bank_rasxod: '-',
                            real_expenses: formatNumber(row.jur1_jur2_rasxod_data?.summa),
                            remainder: formatNumber(row.summa)
                          }) satisfies RemainingRow
                      )
                      .filter((v) => !!v) ?? []
                  }
                  columnDefs={RemainingColumns}
                />
              ) : (
                <GenericTable
                  data={(docs as OdinoxRasxod[]) ?? []}
                  columnDefs={RasxodDocumentColumns}
                  style={{ width: 2000 }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const getCommonColumns = (highlightedMonths: number[]) => {
  let monthColumns: ColumnDef<any>[] = Array.from({ length: 12 })

  monthColumns = monthColumns.map(
    (_, i) =>
      ({
        key: `oy_${i + 1}`,
        header: getMonthName(i + 1),
        className: highlightedMonths.includes(i + 1)
          ? 'bg-brand/60 border-r-brand/80 text-white'
          : '',
        minWidth: 100,
        numeric: true
      }) satisfies ColumnDef<any>
  )

  monthColumns.push({
    key: 'itogo',
    header: 'total',
    className: 'font-bold',
    minWidth: 100,
    numeric: true
  })
  return monthColumns
}

const getSmetaGrafikColumns = (highlightedMonths: number[]) =>
  [
    {
      key: 'id',
      width: 130,
      minWidth: 130,
      renderCell: IDCell
    },
    {
      key: 'year',
      width: 60
    },
    ...getCommonColumns(highlightedMonths)
  ] satisfies ColumnDef<SmetaGrafik>[]

export const RasxodDocumentColumns: ColumnDef<OdinoxRasxod>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    fit: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    fit: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    minWidth: 400,
    numeric: true,
    key: 'summa',
    renderCell: (row) => (
      <div className="font-bold">
        <SummaCell summa={row.summa} />
      </div>
    )
  },
  {
    width: 300,
    key: 'sub_schet',
    header: 'subschet'
  },
  {
    key: 'type',
    renderCell: (row) => <ProvodkaBadge type={row.type} />
  }
]

interface RemainingRow {
  allocated_funds: string
  funds_paid_by_ministry: string
  kassa_rasxod_bank_rasxod: string
  real_expenses: string
  remainder: string
}
export const RemainingColumns: ColumnDef<RemainingRow>[] = [
  {
    key: 'allocated_funds',
    header: <Trans>allocated_funds</Trans>,
    minWidth: 200,
    className: 'bg-brand/60 border-r-brand/80 text-white'
  },
  {
    key: 'funds_paid_by_ministry',
    header: <Trans>funds_paid_by_ministry</Trans>,
    minWidth: 200
  },
  {
    key: 'kassa_rasxod_bank_rasxod',
    header: (
      <>
        <Trans>kassa_rasxod</Trans> / <Trans>bank_rasxod</Trans>
      </>
    ),
    minWidth: 300
  },
  {
    key: 'real_expenses',
    header: <Trans>real_expenses</Trans>,
    minWidth: 200,
    className: 'bg-brand/60 border-r-brand/80 text-white'
  },
  {
    key: 'remainder',
    header: <Trans>remainder</Trans>,
    minWidth: 200,
    className: 'bg-brand/60 border-r-brand/80 text-white'
  }
]
