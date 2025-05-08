// import type { EditorComponentType } from './editors'
// import type { ChangeContext, DeleteContext } from './editors/interfaces'
// import type { Autocomplete } from '@/common/lib/types'
// import type {
//   ComponentProps,
//   HTMLAttributes,
//   MutableRefObject,
//   ReactNode,
//   RefObject,
//   SyntheticEvent
// } from 'react'
// import type { ArrayPath, FieldArrayWithId, UseFormReturn } from 'react-hook-form'
import type { Autocomplete } from '@/common/lib/types'
import type { ComponentType, ReactNode } from 'react'

// export type TableRowField<T extends object, F extends ArrayPath<T>> = FieldArrayWithId<T, F, 'id'>

// export type CellEventHandler<T extends object, F extends ArrayPath<T>> = (
//   args: {
//     event: SyntheticEvent<HTMLTableCellElement>
//   } & Pick<
//     ComponentProps<EditorComponentType<T, F>>,
//     'index' | 'column' | 'value' | 'onChange' | 'row' | 'rows'
//   >
// ) => void

// export interface EditableColumnDef<T extends object, F extends ArrayPath<T> = ArrayPath<T>> {
//   key: Autocomplete<keyof T[F][number]>
//   header?: ReactNode
//   Editor: EditorComponentType<T, F>
//   width?: number | string
//   minWidth?: number | string
//   maxWidth?: number | string
//   className?: string
//   headerClassName?: string
//   columns?: EditableColumnDef<T>[]
//   sticky?: boolean
//   left?: number
//   right?: number
// }

// export type HeaderColumnDef<T> = T & {
//   _depth: number
//   _colSpan: number
//   _rowSpan: number
// }

// export interface EditableTableMethods {
//   scrollToRow: (rowIndex: number) => void
// }

// export interface EditableTableProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
//   readOnly?: boolean
//   disableHeader?: boolean
//   startRowNumber?: number
//   tableRef?: RefObject<HTMLTableElement>
//   tabIndex?: number
//   form: UseFormReturn<T>
//   name: F
//   columnDefs: EditableColumnDef<T, F>[]
//   className?: string
//   divProps?: HTMLAttributes<HTMLDivElement>
//   getRowClassName?: (args: {
//     index: number
//     row: FieldArrayWithId<T, F, 'id'>
//     rows: FieldArrayWithId<T, F, 'id'>[]
//   }) => string
//   getEditorProps?: (
//     args: Pick<
//       ComponentProps<EditorComponentType<T, F>>,
//       'index' | 'column' | 'value' | 'onChange' | 'row' | 'rows'
//     >
//   ) => Record<string, unknown>
//   placeholder?: string
//   onDelete?(ctx: DeleteContext): void
//   onCreate?(): void
//   onCellDoubleClick?: CellEventHandler<T, F>
//   params?: Record<string, unknown>
//   footer?: (props: EditableTableProps<T, F>) => ReactNode
//   validate?(ctx: ChangeContext<T, F>): boolean
//   methods?: RefObject<EditableTableMethods>
// }

// export interface EditableRowProps<T extends object, F extends ArrayPath<NoInfer<T>>>
//   extends Pick<
//       EditableTableProps<T, F>,
//       | 'readOnly'
//       | 'startRowNumber'
//       | 'validate'
//       | 'name'
//       | 'form'
//       | 'params'
//       | 'onDelete'
//       | 'onCellDoubleClick'
//       | 'columnDefs'
//       | 'getEditorProps'
//       | 'getRowClassName'
//     >,
//     HTMLAttributes<HTMLTableRowElement> {
//   dataColumns: EditableColumnDef<T, F>[]
//   tabIndex?: number
//   index: number
//   highlightedRow: MutableRefObject<number | null>
//   row: FieldArrayWithId<T, F, 'id'>
//   rows: FieldArrayWithId<T, F, 'id'>[]
// }

interface BaseColumnDef<T extends object> {
  key: Autocomplete<keyof T>
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

export interface EditableGroupColumnDef<T extends object> extends BaseColumnDef<T> {
  Editor?: never
  columns: EditableColumnDef<T>[]
}
export interface EditableDataColumnDef<T extends object> extends BaseColumnDef<T> {
  Editor: ComponentType
  columns?: never
}

export type EditableColumnDef<T extends object> =
  | EditableGroupColumnDef<T>
  | EditableDataColumnDef<T>

interface User {
  id: number
  name: string
  age: number
  email: string
}

const columns: EditableColumnDef<User>[] = [
  {
    key: 'name',
    Editor: () => <input type="text" />
  },
  {
    key: 'age',
    columns: []
  }
]
