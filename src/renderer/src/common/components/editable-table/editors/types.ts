import type { EditableColumnType } from '../table'
import type { Dispatch, FC, InputHTMLAttributes, SetStateAction } from 'react'
import type { FieldErrors } from 'react-hook-form'

export type ChangeContext<T extends object, K extends keyof T = keyof T> = {
  id: number
  key: K
  payload: T
}

export type DeleteContext = {
  id: number
}

export type EditorComponentType<T extends object> = FC<{
  tabIndex?: number
  id: number
  row: T
  data: T[]
  col: EditableColumnType<T>
  max?: number
  errors?: FieldErrors<T>
  onChange?(ctx: ChangeContext<T>): void
  state: Record<string, unknown>
  setState: Dispatch<SetStateAction<Record<string, unknown>>>
  params: Record<string, unknown>
  validate?: (ctx: ChangeContext<T>) => boolean
}>

export type EditorOptions<
  T extends Record<string, unknown>,
  P = InputHTMLAttributes<HTMLInputElement>
> = {
  key: keyof T
  inputProps?: P
}
