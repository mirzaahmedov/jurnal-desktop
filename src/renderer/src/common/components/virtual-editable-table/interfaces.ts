import type { EditorComponentType } from './editors'
import type { ChangeContext, DeleteContext } from './editors/interfaces'
import type { Autocomplete } from '@/common/lib/types'
import type { ComponentProps, HTMLAttributes, ReactNode, RefObject, SyntheticEvent } from 'react'
import type { ArrayPath, FieldArrayWithId, UseFormReturn } from 'react-hook-form'

export type TableRowField<T extends object, F extends ArrayPath<T>> = FieldArrayWithId<T, F, 'id'>

type Prev = [never, 0, 1, 2, 3, 4, 5]

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never

// Limit recursion to 5 levels deep
export type NestedKeys<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & (string | number)]: T[K] extends object
          ? T[K] extends Array<any>
            ? K
            : K | Join<K, NestedKeys<T[K], Prev[D]>>
          : K
      }[keyof T & (string | number)]
    : ''

export type CellEventHandler<T extends object, F extends ArrayPath<T>> = (
  args: {
    event: SyntheticEvent<HTMLTableCellElement>
  } & Pick<
    ComponentProps<EditorComponentType<T, F>>,
    'index' | 'column' | 'value' | 'onChange' | 'row' | 'rows'
  >
) => void

export interface BaseVirtualEditableColumnDef<
  T extends object,
  F extends ArrayPath<T> = ArrayPath<T>
> {
  key: Autocomplete<keyof T[F][number]>
  header?: ReactNode
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  className?: string
  headerClassName?: string
  sticky?: boolean
  left?: number
  right?: number
}

export interface VirtualGroupEditableColumnDef<
  T extends object,
  F extends ArrayPath<T> = ArrayPath<T>
> extends BaseVirtualEditableColumnDef<T, F> {
  Editor?: never
  columns: VirtualEditableColumnDef<T>[]
}
export interface VirtualLeafEditableColumnDef<
  T extends object,
  F extends ArrayPath<T> = ArrayPath<T>
> extends BaseVirtualEditableColumnDef<T, F> {
  Editor: EditorComponentType<T, F>
  columns?: never
}

export type VirtualEditableColumnDef<T extends object, F extends ArrayPath<T> = ArrayPath<T>> =
  | VirtualGroupEditableColumnDef<T, F>
  | VirtualLeafEditableColumnDef<T, F>

export type HeaderColumnDef<T> = T & {
  _depth: number
  _colSpan: number
  _rowSpan: number
}

export interface EditableTableMethods {
  scrollToRow: (rowIndex: number) => void
}

export interface VirtualEditableTableProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
  readOnly?: boolean
  disableHeader?: boolean
  tableRef?: RefObject<HTMLTableElement>
  tabIndex?: number
  form: UseFormReturn<T>
  name: F
  columnDefs: VirtualEditableColumnDef<T, F>[]
  className?: string
  divProps?: HTMLAttributes<HTMLDivElement>
  getRowClassName?: (args: {
    index: number
    row: FieldArrayWithId<T, F, 'id'>
    rows: FieldArrayWithId<T, F, 'id'>[]
  }) => string
  getEditorProps?: (
    args: Pick<
      ComponentProps<EditorComponentType<T, F>>,
      'index' | 'column' | 'value' | 'onChange' | 'row' | 'rows'
    >
  ) => Record<string, unknown>
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onRowCreate?(): void
  onCellDoubleClick?: CellEventHandler<T, F>
  params?: Record<string, unknown>
  getFooterRows?: (props: VirtualEditableTableProps<T, F>) => FieldArrayWithId<T, F, 'id'>[]
  validate?(ctx: ChangeContext<T, F>): boolean
  methods?: RefObject<EditableTableMethods>
}

export interface VirtualEditableRowProps<T extends object, F extends ArrayPath<NoInfer<T>>>
  extends Pick<
    VirtualEditableTableProps<T, F>,
    | 'readOnly'
    | 'validate'
    | 'name'
    | 'form'
    | 'params'
    | 'onDelete'
    | 'onCellDoubleClick'
    | 'columnDefs'
    | 'getEditorProps'
  > {
  leafColumns: VirtualLeafEditableColumnDef<T, F>[]
  tabIndex?: number
  startRowNumber: number
  index: number
  row: FieldArrayWithId<T, F, 'id'>
  rows: FieldArrayWithId<T, F, 'id'>[]
}
