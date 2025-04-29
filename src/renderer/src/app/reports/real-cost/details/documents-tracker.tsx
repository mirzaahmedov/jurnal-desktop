import type {
  RealCostDocument,
  RealCostProvodka,
  RealCostRasxod,
  RealCostShartnomaGrafik,
  SmetaGrafik
} from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { Trans, useTranslation } from 'react-i18next'

import { EmptyFolder } from '@/common/assets/illustrations/empty-folder'
import { type ColumnDef, GenericTable } from '@/common/components'
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

import { DocType, type GetDocsArgs } from '../service'

const isDocumentProvodka = (_values: unknown, type: DocType): _values is RealCostProvodka[] => {
  return type === DocType.MonthSumma || type === DocType.YearSumma
}
const isDocumentShartnomaGrafik = (
  _values: unknown,
  type: DocType
): _values is RealCostShartnomaGrafik[] => {
  return type === DocType.ContractGrafikMonth || type === DocType.ContractGrafikYear
}

const isDocumentRasxod = (_values: unknown, type: DocType): _values is RealCostRasxod[] => {
  return type === DocType.RasxodMonth || type === DocType.RasxodYear
}

const isRemainingSumma = (
  _values: unknown,
  type: DocType
): _values is RealCostShartnomaGrafik[] => {
  return type === DocType.RemainingMonth || type === DocType.RemainingYear
}

export interface RealCostDocumentsTrackerProps extends Omit<DialogTriggerProps, 'children'> {
  args?: GetDocsArgs
  docs: RealCostDocument[]
  onClose: VoidFunction
}

export const RealCostDocumentsTracker = ({
  args,
  docs,
  onClose
}: RealCostDocumentsTrackerProps) => {
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
                  {args?.type === DocType.MonthSumma || args?.type === DocType.YearSumma
                    ? 'pages.smeta_grafik'
                    : args?.type === DocType.ContractGrafikMonth ||
                        args?.type === DocType.ContractGrafikYear
                      ? 'pages.shartnoma_grafik'
                      : 'documents'}
                </Trans>
              </DialogTitle>
            </DialogHeader>
            <div className="w-full max-w-[1800px] flex-1 overflow-x-auto scrollbar">
              {!args ? null : isDocumentProvodka(docs, args.type) ? (
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
                      args.type === DocType.MonthSumma
                        ? [args.month]
                        : args.type === DocType.YearSumma
                          ? Array.from({ length: args.month }).map((_, i) => i + 1)
                          : []
                    )}
                  />
                )
              ) : isDocumentShartnomaGrafik(docs, args.type) ? (
                <GenericTable
                  data={docs ?? []}
                  columnDefs={getSmetaGrafikColumns(
                    args.type === DocType.ContractGrafikMonth
                      ? [args.month]
                      : args.type === DocType.ContractGrafikYear
                        ? Array.from({ length: args.month }).map((_, i) => i + 1)
                        : []
                  )}
                />
              ) : isDocumentRasxod(docs, args.type) ? (
                <GenericTable
                  data={docs ?? []}
                  columnDefs={RasxodDocumentColumns}
                />
              ) : isRemainingSumma(docs, args.type) ? (
                <GenericTable
                  data={docs ?? []}
                  columnDefs={getShartnomaGrafikColumns([])}
                  style={{ width: 2000 }}
                />
              ) : null}
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

const RasxodDocumentColumns: ColumnDef<RealCostRasxod>[] = [
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
    width: 200,
    key: 'schet'
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

const getShartnomaGrafikColumns = (highlightedMonths: number[]) =>
  [
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
      key: 'contract_grafik_summa',
      header: 'summa',
      numeric: true,
      minWidth: 200,
      className: 'bg-brand/60 border-r-brand/80 text-white font-bold',
      renderCell: (row) => formatNumber(row.contract_grafik_summa)
    },
    {
      key: 'rasxod_summa',
      minWidth: 200,
      numeric: true,
      header: (() => {
        const { t } = useTranslation(['app'])
        return `${t('pages.kassa')} / ${t('bank').toLowerCase()} ${t('rasxod').toLowerCase()}`
      })(),
      className: 'bg-brand/60 border-r-brand/80 text-white font-bold',
      renderCell: (row) => formatNumber(row.rasxod_summa)
    },
    {
      key: 'remaining_summa',
      header: 'remainder',
      numeric: true,
      minWidth: 200,
      className: 'bg-brand/60 border-r-brand/80 text-white font-bold',
      renderCell: (row) => formatNumber(row.remaining_summa)
    },
    ...getCommonColumns(highlightedMonths)
  ] satisfies ColumnDef<RealCostShartnomaGrafik>[]
