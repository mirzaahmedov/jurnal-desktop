import type { EditorComponentType } from './editors'
import type { ChangeContext, DeleteContext } from './editors/types'
import type { Autocomplete } from '@renderer/common/lib/types'
import type { FieldErrors } from 'react-hook-form'

import { type ReactNode, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import { Table, TableBody, TableFooter, TableHeader } from '@renderer/common/components/ui/table'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyList } from '../empty-states'
import { EditableTableCell, EditableTableHead, EditableTableRow } from './components'

export interface EditableColumnDef<T extends object> {
  key: Autocomplete<keyof T>
  header?: ReactNode
  Editor: EditorComponentType<T>
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
}

export interface EditableTableProps<T extends object> {
  tableRef?: React.RefObject<HTMLTableElement>
  tabIndex?: number
  data: T[]
  columns: EditableColumnDef<T>[]
  errors?: FieldErrors<{ example: T[] }>['example']
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onChange?(ctx: ChangeContext<T>): void
  onCreate?(): void
  params?: Record<string, unknown>
  footerRows?: ReactNode
  validate?(ctx: ChangeContext<T>): boolean
}
export const EditableTable = <T extends object>(props: EditableTableProps<T>) => {
  const {
    tableRef,
    tabIndex,
    data,
    columns,
    errors,
    placeholder,
    onCreate,
    onDelete,
    onChange,
    params = {}
  } = props

  const { t } = useTranslation()

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
    >
      <Table
        ref={tableRef}
        className="border border-slate-200"
      >
        <TableHeader>
          <EditableTableRow>
            <EditableTableHead
              key="line_number"
              className="px-3 whitespace-nowrap w-0"
            >
              №
            </EditableTableHead>
            {Array.isArray(columns)
              ? columns.map((col) => {
                  const { key, header, width, minWidth, maxWidth } = col
                  return (
                    <EditableTableHead
                      key={String(key)}
                      style={{
                        width,
                        minWidth,
                        maxWidth
                      }}
                    >
                      {!header ? t(key.toString()) : typeof header === 'string' ? t(header) : null}
                    </EditableTableHead>
                  )
                })
              : null}
            {typeof onDelete === 'function' && <EditableTableHead key="delete"></EditableTableHead>}
          </EditableTableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(data) && data.length ? (
            data.map((row, index) => {
              return (
                <EditableTableRowRenderer
                  key={index}
                  index={index}
                  tabIndex={tabIndex}
                  row={row}
                  data={data}
                  columns={columns}
                  errors={errors}
                  onChange={onChange}
                  onDelete={onDelete}
                  params={params}
                  validate={props.validate}
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
                >
                  {placeholder}
                </EmptyList>
              </EditableTableCell>
            </EditableTableRow>
          )}
        </TableBody>
        {typeof onCreate === 'function' && (
          <TableFooter>
            {props.footerRows}
            <EditableTableRow>
              <EditableTableCell colSpan={100}>
                <Button
                  tabIndex={tabIndex}
                  type="button"
                  variant="ghost"
                  className="w-full hover:bg-slate-50 text-brand hover:text-brand"
                  onClick={onCreate}
                >
                  <CirclePlus className="btn-icon icon-start" /> {t('add')}
                </Button>
              </EditableTableCell>
            </EditableTableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}

type EditableTableRowRendererProps<T extends object> = {
  tabIndex?: number
  index: number
  columns: EditableColumnDef<T>[]
  row: T
  data: T[]
  errors?: FieldErrors<{ example: T[] }>['example']
  onDelete?(ctx: DeleteContext): void
  onChange?(ctx: ChangeContext<T>): void
  params: Record<string, unknown>
  validate?: (ctx: ChangeContext<T>) => boolean
}
const EditableTableRowRenderer = <T extends object>({
  tabIndex,
  index,
  columns,
  row,
  data,
  errors,
  onDelete,
  onChange,
  params,
  validate
}: EditableTableRowRendererProps<T>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  return (
    <EditableTableRow>
      <EditableTableCell
        key="line_number"
        className="px-3 font-medium"
      >
        {index + 1}
      </EditableTableCell>
      {columns.map((col) => {
        const { key, Editor, width, minWidth, maxWidth } = col
        return (
          <EditableTableCell
            key={String(key)}
            style={{ width, minWidth, maxWidth }}
          >
            <Editor
              tabIndex={tabIndex}
              id={index}
              row={row}
              data={data}
              col={col}
              onChange={onChange}
              errors={errors?.[index] as FieldErrors<T>}
              state={state}
              setState={setState}
              params={params}
              validate={validate}
              data-editorId={`${index}-${String(key)}`}
            />
          </EditableTableCell>
        )
      })}
      {typeof onDelete === 'function' && (
        <EditableTableCell className="whitespace-nowrap w-0">
          <Button
            tabIndex={tabIndex}
            type="button"
            variant="ghost"
            className="hover:bg-slate-50 hover:text-red-500 text-red-400"
            onClick={() => onDelete?.({ id: index })}
          >
            <CircleMinus className="btn-icon !mx-0" />
          </Button>
        </EditableTableCell>
      )}
    </EditableTableRow>
  )
}
