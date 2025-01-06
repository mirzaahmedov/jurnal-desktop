import type { Dispatch, FunctionComponent, SetStateAction } from 'react'

import type { EditableColumnType } from '../table'
import type { FieldErrors } from 'react-hook-form'

export type ChangeContext<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
  id: number
  key: K
  payload: T
}

export type DeleteContext = {
  id: number
}

export type EditorComponentType<T extends Record<string, unknown>> = FunctionComponent<{
  tabIndex?: number
  id: number
  row: T
  col: EditableColumnType<T>
  max?: number
  errors?: FieldErrors<T>
  onChange?(ctx: ChangeContext<T>): void
  state: Record<string, unknown>
  setState: Dispatch<SetStateAction<Record<string, unknown>>>
  params: Record<string, unknown>
}>

export type EditorOptions<T extends Record<string, unknown>> = {
  key: keyof T
}
