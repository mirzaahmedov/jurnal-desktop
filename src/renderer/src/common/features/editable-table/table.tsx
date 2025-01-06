import { ChangeContext, DeleteContext } from './editors/types'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { EditableTableCell, EditableTableHead, EditableTableRow } from './components'
import { Table, TableBody, TableFooter, TableHeader } from '@renderer/common/components/ui/table'

import { Autocomplete } from '@renderer/common/lib/types'
import { Button } from '@renderer/common/components/ui/button'
import type { EditorComponentType } from './editors'
import { FieldErrors } from 'react-hook-form'
import { useState, type ReactNode } from 'react'

export type EditableColumnType<T extends Record<string, unknown>> = {
  key: Autocomplete<keyof T>
  header: ReactNode
  Editor: EditorComponentType<T>
  width?: string | number
}

export type EditableTableProps<T extends Record<string, unknown>> = {
  tabIndex?: number
  data: T[]
  columns: EditableColumnType<T>[]
  errors?: FieldErrors<{ example: T[] }>['example']
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onChange?(ctx: ChangeContext<T>): void
  onCreate?(): void
  params?: Record<string, unknown>
}
export const EditableTable = <T extends Record<string, unknown>>(props: EditableTableProps<T>) => {
  const {
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onCreate?.()
      }}
      onFocus={(e) => {
        e.target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }}
    >
      <Table className="border border-slate-200">
        <TableHeader>
          <EditableTableRow>
            {Array.isArray(columns)
              ? columns.map((col) => {
                  const { key, header, width } = col
                  return (
                    <EditableTableHead
                      key={String(key)}
                      style={{ width }}
                    >
                      {header}
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
                  columns={columns}
                  errors={errors}
                  onChange={onChange}
                  onDelete={onDelete}
                  params={params}
                />
              )
            })
          ) : (
            <EditableTableRow>
              <EditableTableCell
                colSpan={100}
                className="text-center"
              >
                {placeholder ?? 'No data available.'}
              </EditableTableCell>
            </EditableTableRow>
          )}
        </TableBody>
        {typeof onCreate === 'function' && (
          <TableFooter>
            <EditableTableRow>
              <EditableTableCell colSpan={100}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full hover:bg-slate-50 text-brand hover:text-brand"
                >
                  <CirclePlus className="btn-icon icon-start" /> Добавить
                </Button>
              </EditableTableCell>
            </EditableTableRow>
          </TableFooter>
        )}
      </Table>
    </form>
  )
}

type EditableTableRowRendererProps<T extends Record<string, unknown>> = {
  tabIndex?: number
  index: number
  columns: EditableColumnType<T>[]
  row: T
  errors?: FieldErrors<{ example: T[] }>['example']
  onDelete?(ctx: DeleteContext): void
  onChange?(ctx: ChangeContext<T>): void
  params: Record<string, unknown>
}
const EditableTableRowRenderer = <T extends Record<string, unknown>>({
  tabIndex,
  index,
  columns,
  row,
  errors,
  onDelete,
  onChange,
  params
}: EditableTableRowRendererProps<T>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  return (
    <EditableTableRow>
      {columns.map((col) => {
        const { key, Editor, width } = col
        return (
          <EditableTableCell
            key={String(key)}
            style={{ width }}
          >
            <Editor
              tabIndex={tabIndex}
              id={index}
              row={row}
              col={col}
              onChange={onChange}
              errors={errors?.[index] as FieldErrors<T>}
              state={state}
              setState={setState}
              params={params}
            />
          </EditableTableCell>
        )
      })}
      {typeof onDelete === 'function' && (
        <EditableTableCell className="whitespace-nowrap w-0">
          <Button
            type="button"
            variant="ghost"
            className="hover:bg-slate-50 hover:text-brand text-slate-400"
            onClick={() => onDelete?.({ id: index })}
          >
            <CircleMinus className="btn-icon !mx-0" />
          </Button>
        </EditableTableCell>
      )}
    </EditableTableRow>
  )
}
