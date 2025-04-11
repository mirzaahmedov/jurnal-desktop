import type { EditableColumnDef, EditableTableRowData } from '../interface'
import type { Dispatch, FC, InputHTMLAttributes, Ref, SetStateAction } from 'react'
import type { FieldErrors, UseFormReturn } from 'react-hook-form'

export type ChangeContext<T extends object, K extends keyof T = keyof T> = {
  id: number
  key: K
  payload: T
}

export type DeleteContext = {
  id: number
}

export type EditorComponent<T extends object> = FC<{
  tabIndex?: number
  inputRef: Ref<HTMLElement>
  id: number
  row: EditableTableRowData<T>
  rows: EditableTableRowData<T>[]
  form: UseFormReturn<any> // Todo fix this type
  col: EditableColumnDef<T>
  max?: number
  errors?: FieldErrors<T>
  value: unknown
  onChange?: (value: unknown) => void
  state: Record<string, unknown>
  setState: Dispatch<SetStateAction<Record<string, unknown>>>
  params: Record<string, unknown>
  validate?: (ctx: ChangeContext<T>) => boolean
}>

export type EditorOptions<T extends object, P = InputHTMLAttributes<HTMLInputElement>> = {
  key: keyof T
  inputProps?: P
}
