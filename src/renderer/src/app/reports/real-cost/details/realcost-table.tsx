import type { RealCostTableRow } from './interfaces'

import { type MutableRefObject, type RefObject, memo, useImperativeHandle, useRef } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslation } from 'react-i18next'

import { NumericInput, type NumericInputProps } from '@/common/components'
import {
  type EditableTableMethods,
  TableCell,
  TableHead,
  TableRow,
  type TableRowProps
} from '@/common/components/editable-table-alt'
import { EmptyList } from '@/common/components/empty-states'
import { Input, type InputProps } from '@/common/components/ui/input'
import { Table, TableBody, TableHeader } from '@/common/components/ui/table'
import { inputVariants } from '@/common/features/spravochnik'
import { formatLocaleDate } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

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

export interface RealCostTableProps {
  rows: RealCostTableRow[]
  methods?: RefObject<EditableTableMethods>
}
export const RealCostTable = memo(({ rows, methods }: RealCostTableProps) => {
  const ref = useRef<HTMLTableElement>(null)
  const highlightedRow = useRef<number | null>(null)

  const { t } = useTranslation(['app'])

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 44,
    overscan: 5
  })

  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        rowVirtualizer.scrollToIndex(rowIndex, {
          align: 'center',
          behavior: 'smooth'
        })
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
      className="relative h-full flex flex-col overflow-y-hidden overflow-x-auto scrollbar"
    >
      <Table className="w-max border border-slate-200 table-fixed">
        <TableHeader className="shadow-sm">
          <TableRow style={{ height: 44 }}>
            <TableHead
              className="px-3 whitespace-nowrap text-sm font-medium"
              style={{
                width: `${String(rows.length + 0).length + 3}ch`
              }}
              rowSpan={2}
            ></TableHead>
            <TableHead
              rowSpan={2}
              style={{ width: 300 }}
            >
              {t('name')}
            </TableHead>
            <TableHead
              rowSpan={2}
              style={{ width: 100 }}
              className="sticky left-0 z-50"
            >
              {t('number')}
            </TableHead>
            <TableHead
              colSpan={6}
              className="text-center"
            >
              {t('for_month')}
            </TableHead>
            <TableHead
              colSpan={6}
              className="text-center !bg-slate-200 border-slate-300"
            >
              {t('for_year')}
            </TableHead>
          </TableRow>
          <TableRow style={{ height: 50 }}>
            <TableHead
              style={{ width: 140 }}
              className="text-end"
            >
              {t('pages.smeta_grafik')}
            </TableHead>
            <TableHead style={{ width: 140 }}>№ / {t('date')}</TableHead>
            <TableHead style={{ width: 300 }}>{t('organization')}</TableHead>
            <TableHead
              style={{ width: 140 }}
              className="text-end"
            >
              {t('summa')}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="text-end"
            >
              {t('pages.kassa')}/{t('bank').toLowerCase()} {t('rasxod').toLowerCase()}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="text-end"
            >
              {t('remainder')}
            </TableHead>

            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('pages.smeta_grafik')}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300"
            >
              № / {t('date')}
            </TableHead>
            <TableHead
              style={{ width: 300 }}
              className="!bg-slate-200 border-slate-300"
            >
              {t('organization')}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('summa')}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('pages.kassa')}/{t('bank').toLowerCase()} {t('rasxod').toLowerCase()}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('remainder')}
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      <div
        className="w-min overflow-x-hidden overflow-y-auto flex-1 scrollbar"
        ref={ref}
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          <Table className="border border-slate-200 table-fixed">
            {/* <TableHeader className="shadow-sm sticky top-0 z-100 bg-white"> */}
            {/* <TableRow style={{ height: 44 }}>
            <TableHead
              className="px-3 whitespace-nowrap text-sm font-medium"
              style={{
                width: `${String(rows.length + 0).length + 3}ch`
              }}
              rowSpan={2}
            ></TableHead>
            <TableHead
              rowSpan={2}
              style={{ width: 300 }}
            >
              {t('name')}
            </TableHead>
            <TableHead
              rowSpan={2}
              style={{ width: 100 }}
              className="sticky left-0 z-50"
            >
              {t('number')}
            </TableHead>
            <TableHead
              colSpan={6}
              className="text-center"
            >
              {t('for_month')}
            </TableHead>
            <TableHead
              colSpan={6}
              className="text-center !bg-slate-200 border-slate-300"
            >
              {t('for_year')}
            </TableHead>
          </TableRow>
          <TableRow style={{ height: 50 }}>
            <TableHead
              style={{ width: 140 }}
              className="text-end"
            >
              {t('pages.smeta_grafik')}
            </TableHead>
            <TableHead style={{ width: 140 }}>№ / {t('date')}</TableHead>
            <TableHead style={{ width: 300 }}>{t('organization')}</TableHead>
            <TableHead className="text-end">{t('summa')}</TableHead>
            <TableHead
              style={{ width: 140 }}
              className="text-end"
            >
              {t('pages.kassa')}/{t('bank').toLowerCase()} {t('rasxod').toLowerCase()}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="text-end"
            >
              {t('remainder')}
            </TableHead>

            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('pages.smeta_grafik')}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300"
            >
              № / {t('date')}
            </TableHead>
            <TableHead
              style={{ width: 300 }}
              className="!bg-slate-200 border-slate-300"
            >
              {t('organization')}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('summa')}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('pages.kassa')}/{t('bank').toLowerCase()} {t('rasxod').toLowerCase()}
            </TableHead>
            <TableHead
              style={{ width: 140 }}
              className="!bg-slate-200 border-slate-300 text-end"
            >
              {t('remainder')}
            </TableHead>
          </TableRow> */}
            {/* </TableHeader> */}

            <TableBody>
              {Array.isArray(rows) && rows.length ? (
                rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                  const row = rows[virtualRow.index]
                  return (
                    <Row
                      key={virtualRow.index}
                      index={virtualRow.index}
                      row={row}
                      rows={rows}
                      highlightedRow={highlightedRow}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
                      }}
                    />
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={100}
                    className="text-center py-5"
                  >
                    <EmptyList
                      iconProps={{
                        className: 'w-40'
                      }}
                    ></EmptyList>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
})

interface RowProps extends TableRowProps {
  index: number
  row: RealCostTableRow
  rows: RealCostTableRow[]
  highlightedRow: MutableRefObject<number | null>
}
const Row = ({ index, row, rows, highlightedRow, ...props }: RowProps) => {
  return (
    <TableRow
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
          <TableCell
            key="line_number"
            className="px-3 font-medium"
            style={{
              width: `${String(rows.length + 1).length + 3}ch`
            }}
            rowSpan={row.size}
          >
            {index + 1}
          </TableCell>
          <TableCell
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
          </TableCell>
          <TableCell
            rowSpan={row.size}
            style={{ width: 100 }}
            className="sticky left-0 z-50"
          >
            <TextEditor
              value={row.smeta_number}
              className="font-bold"
              style={{
                height: row.size * 44
              }}
              readOnly
            />
          </TableCell>
          <TableCell
            rowSpan={row.size}
            style={{ width: 140 }}
          >
            <NumberEditor
              value={row.month_summa}
              defaultValue={0}
              style={{
                height: row.size * 44
              }}
              readOnly
            />
          </TableCell>
        </>
      )}

      <TableCell style={{ width: 140 }}>
        <TextEditor
          value={row.doc_num ? `${row?.doc_num} / ${formatLocaleDate(row?.doc_date)}` : ''}
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 300 }}>
        <TextEditor
          value={row?.name ?? ''}
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.itogo ?? ''}
          defaultValue={0}
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.rasxod_summa ?? ''}
          defaultValue={0}
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.remaining_summa ?? ''}
          defaultValue={0}
          readOnly
        />
      </TableCell>

      {row.first && (
        <TableCell
          rowSpan={row.size}
          style={{ width: 140 }}
        >
          <NumberEditor
            value={row.year_summa}
            defaultValue={0}
            style={{
              height: row.size * 44
            }}
            readOnly
          />
        </TableCell>
      )}
      <TableCell style={{ width: 140 }}>
        <TextEditor
          value={
            row.doc_num_year ? `${row?.doc_num_year} / ${formatLocaleDate(row?.doc_date_year)}` : ''
          }
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 300 }}>
        <TextEditor
          value={row?.name_year ?? ''}
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.itogo_year ?? ''}
          defaultValue={0}
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.rasxod_summa_year ?? ''}
          defaultValue={0}
          readOnly
        />
      </TableCell>
      <TableCell style={{ width: 140 }}>
        <NumberEditor
          value={row?.remaining_summa_year ?? ''}
          defaultValue={0}
          readOnly
        />
      </TableCell>
    </TableRow>
  )
}
