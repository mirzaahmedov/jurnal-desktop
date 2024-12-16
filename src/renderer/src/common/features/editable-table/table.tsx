import type { ReactNode } from 'react'
import type { EditorComponentType } from './editors'

import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { EditableTableRow, EditableTableHead, EditableTableCell } from './components'
import { Button } from '@/common/components/ui/button'
import { FieldErrors } from 'react-hook-form'
import { ChangeContext, DeleteContext } from './editors/types'
import { CircleMinus, CirclePlus } from 'lucide-react'

export type EditableColumnType<T extends Record<string, unknown>> = {
  key: keyof T
  header: ReactNode
  Editor: EditorComponentType<T>
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
}
export const EditableTable = <T extends Record<string, unknown>>(props: EditableTableProps<T>) => {
  const { tabIndex, data, columns, errors, placeholder, onCreate, onDelete, onChange } = props
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onCreate?.()
      }}
      onFocus={(e) => {
        e.currentTarget.scrollIntoView({
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
                  const { key, header: content } = col
                  return <EditableTableHead key={String(key)}>{content}</EditableTableHead>
                })
              : null}
            {typeof onDelete === 'function' && <EditableTableHead key="delete"></EditableTableHead>}
          </EditableTableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(data) && data.length ? (
            data.map((row, index) => {
              return (
                <EditableTableRow key={index}>
                  {columns.map((col) => {
                    const { key, Editor: EditorComponent } = col
                    return (
                      <EditableTableCell key={String(key)}>
                        <EditorComponent
                          tabIndex={tabIndex}
                          id={index}
                          row={row}
                          col={col}
                          onChange={onChange}
                          errors={errors?.[index] as FieldErrors<T>}
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
            })
          ) : (
            <EditableTableRow>
              <EditableTableCell colSpan={100} className="text-center">
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
