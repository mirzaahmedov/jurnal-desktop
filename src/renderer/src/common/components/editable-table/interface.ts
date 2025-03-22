import type { EditorComponentType } from './editors'
import type { Autocomplete } from '@renderer/common/lib/types'
import type { ReactNode } from 'react'

export interface EditableColumnDef<T extends object> {
  key: Autocomplete<keyof T>
  header?: ReactNode
  Editor: EditorComponentType<T>
  width?: number
  minWidth?: number
  maxWidth?: number
  className?: string
  headerClassName?: string
  columns?: EditableColumnDef<T>[]
}

export type HeaderColumnDef<T> = T & {
  _depth: number
  _colSpan: number
  _rowSpan: number
}
