import type { EditableColumnType } from '../table'
import type { FieldErrors } from 'react-hook-form'
import type { ReactNode } from 'react'

export type ChangeContext<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
  id: number
  key: K
  payload: T
}

export type DeleteContext = {
  id: number
}

export type EditorComponentType<T extends Record<string, unknown>> = (props: {
  tabIndex?: number
  id: number
  row: T
  col: EditableColumnType<T>
  max?: number
  errors?: FieldErrors<T>
  onChange?(ctx: ChangeContext<T>): void
}) => ReactNode

export type EditorOptions<T extends Record<string, unknown>> = {
  key: keyof T
}
