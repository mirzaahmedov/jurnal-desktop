import type { RealCostTableRow } from './interfaces'
import type { EditableTableMethods } from '@/common/components/editable-table/interface'

import {
  type ComponentProps,
  type MutableRefObject,
  type RefObject,
  memo,
  useImperativeHandle,
  useRef
} from 'react'

import { useTranslation } from 'react-i18next'

import { NumericInput, type NumericInputProps } from '@/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@/common/components/editable-table/components'
import { EmptyList } from '@/common/components/empty-states'
import { Input, type InputProps } from '@/common/components/ui/input'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { inputVariants } from '@/common/features/spravochnik'
import { formatLocaleDate } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

import { DocType } from '../service'

const TextEditor = ({ value, defaultValue, className, ...props }: InputProps) => {
  return (
    <Input
      value={typeof value === 'string' || typeof value === 'number' ? value : (defaultValue ?? '')}
      className={cn(
        inputVariants({
          editor: true
        }),
        'disabled:opacity-100 disabled:ring-0 disabled:focus-visible:ring-0 disabled:outline-none',
        className
      )}
      autoComplete="off"
      {...props}
    />
  )
}
const NumberEditor = ({ value, defaultValue, className, ...props }: NumericInputProps) => {
  return (
    <NumericInput
      value={
        typeof value === 'string' || typeof value === 'number'
          ? Number(value) !== 0
            ? Number(value)
            : (Number(defaultValue) ?? '')
          : (Number(defaultValue) ?? '')
      }
      className={cn(
        inputVariants({
          editor: true
        }),
        className
      )}
      autoComplete="off"
      {...props}
    />
  )
}

export interface CellDoubleClickArgs {
  row: RealCostTableRow
  rowIndex: number
  type: DocType
}
export interface RealCostTableProps {
  rows: RealCostTableRow[]
  itogo: RealCostTableRow
  methods?: RefObject<EditableTableMethods>
  onCellDoubleClick?: (args: CellDoubleClickArgs) => void
}
export const RealCostTable = memo(
  ({ rows, itogo, methods, onCellDoubleClick }: RealCostTableProps) => {
    const ref = useRef<HTMLTableElement>(null)
    const highlightedRow = useRef<number | null>(null)

    const { t } = useTranslation(['app'])

    useImperativeHandle(
      methods,
      () => ({
        scrollToRow: (rowIndex: number) => {
          const element = ref.current?.querySelector(`[data-rowindex="${rowIndex}"]`)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
            element?.querySelector('input')?.focus()
          }
          highlightedRow.current = rowIndex
        }
      }),
      []
    )

    return (
      <div
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onFocus={(e) => {
          e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }}
        className="relative h-full flex flex-col overflow-auto scrollbar"
      >
        <Table className="w-max border border-slate-200 table-fixed sticky top-0 z-100">
          <TableHeader className="shadow-sm">
            <EditableTableRow style={{ height: 44 }}>
              <EditableTableHead
                className="px-3 whitespace-nowrap text-sm font-medium"
                style={{
                  width: `${String(rows.length + 0).length + 3}ch`
                }}
                rowSpan={2}
              ></EditableTableHead>
              <EditableTableHead
                rowSpan={2}
                style={{ width: 300 }}
              >
                {t('name')}
              </EditableTableHead>
              <EditableTableHead
                rowSpan={2}
                style={{ width: 100 }}
                className="sticky left-0 z-50"
              >
                {t('number')}
              </EditableTableHead>
              <EditableTableHead
                colSpan={6}
                className="text-center"
              >
                {t('for_month')}
              </EditableTableHead>
              <EditableTableHead
                colSpan={6}
                className="text-center !bg-slate-200 border-slate-300"
              >
                {t('for_year')}
              </EditableTableHead>
            </EditableTableRow>
            <EditableTableRow style={{ height: 50 }}>
              <EditableTableHead
                style={{ width: 140 }}
                className="text-end"
              >
                {t('pages.smeta_grafik')}
              </EditableTableHead>
              <EditableTableHead style={{ width: 140 }}>№ / {t('date')}</EditableTableHead>
              <EditableTableHead style={{ width: 300 }}>{t('organization')}</EditableTableHead>
              <EditableTableHead
                style={{ width: 140 }}
                className="text-end"
              >
                {t('summa')}
              </EditableTableHead>
              <EditableTableHead
                style={{ width: 140 }}
                className="text-end"
              >
                {t('pages.kassa')}/{t('bank').toLowerCase()} {t('rasxod').toLowerCase()}
              </EditableTableHead>
              <EditableTableHead
                style={{ width: 140 }}
                className="text-end"
              >
                {t('remainder')}
              </EditableTableHead>

              <EditableTableHead
                style={{ width: 140 }}
                className="!bg-slate-200 border-slate-300 text-end"
              >
                {t('pages.smeta_grafik')}
              </EditableTableHead>
              <EditableTableHead
                style={{ width: 140 }}
                className="!bg-slate-200 border-slate-300"
              >
                № / {t('date')}
              </EditableTableHead>
              <EditableTableHead
                style={{ width: 300 }}
                className="!bg-slate-200 border-slate-300"
              >
                {t('organization')}
              </EditableTableHead>
              <EditableTableHead
                style={{ width: 140 }}
                className="!bg-slate-200 border-slate-300 text-end"
              >
                {t('summa')}
              </EditableTableHead>
              <EditableTableHead
                style={{ width: 140 }}
                className="!bg-slate-200 border-slate-300 text-end"
              >
                {t('pages.kassa')}/{t('bank').toLowerCase()} {t('rasxod').toLowerCase()}
              </EditableTableHead>
              <EditableTableHead
                style={{ width: 140 }}
                className="!bg-slate-200 border-slate-300 text-end"
              >
                {t('remainder')}
              </EditableTableHead>
            </EditableTableRow>
          </TableHeader>
        </Table>

        <div
          className="min-w-min flex-1"
          ref={ref}
        >
          <Table className="static border border-slate-200 table-fixed">
            <TableBody>
              {Array.isArray(rows) && rows.length ? (
                rows.map((row, index) => {
                  return (
                    <Row
                      key={index}
                      index={index}
                      row={row}
                      rows={rows}
                      highlightedRow={highlightedRow}
                      onCellDoubleClick={onCellDoubleClick}
                    />
                  )
                })
              ) : (
                <EditableTableRow>
                  <EditableTableCell
                    colSpan={100}
                    className="text-center py-5"
                  >
                    <EmptyList
                      iconProps={{
                        className: 'w-40'
                      }}
                    ></EmptyList>
                  </EditableTableCell>
                </EditableTableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Table className="w-max border border-slate-200 table-fixed sticky bottom-0 z-100">
          <TableFooter className="shadow-sm">
            <Row
              focusable={false}
              index={rows.length}
              row={itogo}
              rows={rows}
              highlightedRow={highlightedRow}
            />
          </TableFooter>
        </Table>
      </div>
    )
  }
)

interface RowProps
  extends ComponentProps<typeof EditableTableRow>,
    Pick<RealCostTableProps, 'rows' | 'onCellDoubleClick'> {
  index: number
  row: RealCostTableRow
  highlightedRow: MutableRefObject<number | null>
}
const Row = ({ index, row, rows, highlightedRow, onCellDoubleClick, ...props }: RowProps) => {
  return (
    <EditableTableRow
      key={index}
      rowRef={(element) => {
        if (index === highlightedRow?.current) {
          highlightedRow.current = null
          const input = element?.querySelector(`input`) as HTMLInputElement
          input?.focus()
        }
      }}
      data-rowindex={index}
      {...props}
    >
      {row.first && (
        <>
          <EditableTableCell
            key="line_number"
            className="px-3 font-medium"
            style={{
              width: `${String(rows.length + 1).length + 3}ch`
            }}
            rowSpan={row.size}
          >
            {index + 1}
          </EditableTableCell>
          <EditableTableCell
            rowSpan={row.size}
            style={{ width: 300 }}
          >
            <TextEditor
              value={row.smeta_name}
              style={{
                height: row.size * 44
              }}
              readOnly
            />
          </EditableTableCell>
          <EditableTableCell
            rowSpan={row.size}
            style={{ width: 100 }}
            className="sticky left-0 z-50"
          >
            <TextEditor
              value={row.smeta_number}
              className="relative font-bold z-50"
              style={{
                height: row.size * 44
              }}
              readOnly
            />
          </EditableTableCell>
          <EditableTableCell
            rowSpan={row.size}
            style={{ width: 140 }}
          >
            <NumberEditor
              value={row.month_summa}
              defaultValue={0}
              style={{
                height: row.size * 44
              }}
              onDoubleClick={() => {
                onCellDoubleClick?.({
                  row,
                  rowIndex: index,
                  type: DocType.MonthSumma
                })
              }}
              readOnly
            />
          </EditableTableCell>
        </>
      )}

      <EditableTableCell style={{ width: 140 }}>
        <TextEditor
          value={row.doc_num ? `${row?.doc_num} / ${formatLocaleDate(row?.doc_date)}` : ''}
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 300 }}>
        <TextEditor
          value={row?.name ?? ''}
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.contract_grafik_summa ?? ''}
          defaultValue={0}
          onDoubleClick={() => {
            onCellDoubleClick?.({
              row,
              rowIndex: index,
              type: DocType.ContractGrafikMonth
            })
          }}
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.rasxod_summa ?? ''}
          defaultValue={0}
          onDoubleClick={() => {
            onCellDoubleClick?.({
              row,
              rowIndex: index,
              type: DocType.RasxodMonth
            })
          }}
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.remaining_summa ?? ''}
          defaultValue={0}
          onDoubleClick={() => {
            onCellDoubleClick?.({
              row,
              rowIndex: index,
              type: DocType.RemainingMonth
            })
          }}
          readOnly
        />
      </EditableTableCell>

      {row.first && (
        <EditableTableCell
          rowSpan={row.size}
          style={{ width: 140 }}
        >
          <NumberEditor
            value={row.year_summa}
            defaultValue={0}
            style={{
              height: row.size * 44
            }}
            onDoubleClick={() => {
              onCellDoubleClick?.({
                row,
                rowIndex: index,
                type: DocType.YearSumma
              })
            }}
            readOnly
          />
        </EditableTableCell>
      )}
      <EditableTableCell style={{ width: 140 }}>
        <TextEditor
          value={
            row.doc_num_year ? `${row?.doc_num_year} / ${formatLocaleDate(row?.doc_date_year)}` : ''
          }
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 300 }}>
        <TextEditor
          value={row?.name_year ?? ''}
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.contract_grafik_summa_year ?? ''}
          onDoubleClick={() => {
            onCellDoubleClick?.({
              row,
              rowIndex: index,
              type: DocType.ContractGrafikYear
            })
          }}
          defaultValue={0}
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.rasxod_summa_year ?? ''}
          defaultValue={0}
          onDoubleClick={() => {
            onCellDoubleClick?.({
              row,
              rowIndex: index,
              type: DocType.RasxodYear
            })
          }}
          readOnly
        />
      </EditableTableCell>
      <EditableTableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.remaining_summa_year ?? ''}
          defaultValue={0}
          onDoubleClick={() => {
            onCellDoubleClick?.({
              row,
              rowIndex: index,
              type: DocType.RemainingYear
            })
          }}
          readOnly
        />
      </EditableTableCell>
    </EditableTableRow>
  )
}
