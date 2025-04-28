import type { RealCostProvodka } from '@/common/models'

import { type RefObject, memo, useImperativeHandle, useRef } from 'react'

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
  rows: RealCostProvodka[]
  methods?: RefObject<EditableTableMethods>
}
export const RealCostTable = memo(({ rows, methods }: RealCostTableProps) => {
  const ref = useRef<HTMLTableElement>(null)

  const { t } = useTranslation(['app'])

  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        const rowElement = ref.current?.querySelector(
          `[data-rowindex="${rowIndex}"]`
        ) as HTMLTableRowElement | null

        if (rowElement) {
          rowElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })

          const inputElement = rowElement.querySelector(
            'input:not(:disabled), textarea:not(:disabled), select:not(:disabled)'
          ) as HTMLInputElement
          inputElement?.focus?.({
            preventScroll: true
          })
        }
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
              rows.map((row, index) => {
                return (
                  <Row
                    key={index}
                    index={index}
                    row={row}
                    rows={rows}
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
  )
})

interface RowProps extends TableRowProps {
  index: number
  row: RealCostProvodka
  rows: RealCostProvodka[]
}
const Row = ({ index: rowIndex, row, rows, ...props }: RowProps) => {
  const maxLength = Math.max(row.by_month?.length, row.by_year?.length, 1)

  return Array.from({ length: maxLength }).map((_, index) => {
    const month = row.by_month?.[index]
    const year = row.by_year?.[index]

    return (
      <TableRow
        key={rowIndex + index}
        data-rowindex={rowIndex}
        {...props}
      >
        {index === 0 && (
          <>
            <TableCell
              key="line_number"
              className="px-3 font-medium"
              style={{
                width: `${String(rows.length + 1).length + 3}ch`
              }}
              rowSpan={maxLength}
            >
              {rowIndex + 1}
            </TableCell>
            <TableCell
              rowSpan={maxLength}
              style={{ width: 300 }}
            >
              <TextEditor
                value={row.smeta_name}
                style={{
                  height: maxLength * 44
                }}
                readOnly
              />
            </TableCell>
            <TableCell
              rowSpan={maxLength}
              style={{ width: 100 }}
              className="sticky left-0 z-50"
            >
              <TextEditor
                value={row.smeta_number}
                className="font-bold"
                style={{
                  height: maxLength * 44
                }}
                readOnly
              />
            </TableCell>
            <TableCell
              rowSpan={maxLength}
              style={{ width: 140 }}
            >
              <NumberEditor
                value={row.month_summa}
                defaultValue={0}
                style={{
                  height: maxLength * 44
                }}
                readOnly
              />
            </TableCell>
          </>
        )}

        <TableCell style={{ width: 140 }}>
          <TextEditor
            value={month ? `${month?.doc_num} / ${formatLocaleDate(month?.doc_date)}` : ''}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 300 }}>
          <TextEditor
            value={month?.name ?? ''}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 140 }}>
          <NumberEditor
            value={month?.itogo ?? ''}
            defaultValue={0}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 140 }}>
          <NumberEditor
            value={month?.rasxod_summa ?? ''}
            defaultValue={0}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 140 }}>
          <NumberEditor
            value={month?.remaining_summa ?? ''}
            defaultValue={0}
            readOnly
          />
        </TableCell>

        {index === 0 && (
          <TableCell
            rowSpan={maxLength}
            style={{ width: 140 }}
          >
            <NumberEditor
              value={row.year_summa}
              defaultValue={0}
              style={{
                height: maxLength * 44
              }}
              readOnly
            />
          </TableCell>
        )}
        <TableCell style={{ width: 140 }}>
          <TextEditor
            value={year ? `${year?.doc_num} / ${formatLocaleDate(year?.doc_date)}` : ''}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 300 }}>
          <TextEditor
            value={year?.name ?? ''}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 140 }}>
          <NumberEditor
            value={year?.itogo ?? ''}
            defaultValue={0}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 140 }}>
          <NumberEditor
            value={year?.rasxod_summa ?? ''}
            defaultValue={0}
            readOnly
          />
        </TableCell>
        <TableCell style={{ width: 140 }}>
          <NumberEditor
            value={year?.remaining_summa ?? ''}
            defaultValue={0}
            readOnly
          />
        </TableCell>
      </TableRow>
    )
  })
}
