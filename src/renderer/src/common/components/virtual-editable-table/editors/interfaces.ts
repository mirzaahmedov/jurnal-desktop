import type { TableRowField, VirtualEditableColumnDef } from '../interfaces'
import type { Dispatch, FC, InputHTMLAttributes, Ref, SetStateAction } from 'react'
import type { ArrayPath, FieldError, FieldErrors, UseFormReturn } from 'react-hook-form'

export type ChangeContext<T extends object, K> = {
  id: number
  key: K
  values: T
}

export type DeleteContext = {
  id: number
}

export type EditorComponent<T extends object, F extends ArrayPath<NoInfer<T>>> = FC<{
  readOnly?: boolean
  tabIndex?: number
  inputRef: Ref<HTMLInputElement>
  index: number
  row: TableRowField<T, F>
  rows: TableRowField<T, F>[]
  form: UseFormReturn<T>
  column: VirtualEditableColumnDef<T>
  max?: number
  error?: FieldError
  errors?: FieldErrors<T>
  value: unknown
  onChange?: (value: unknown) => void
  state: Record<string, unknown>
  setState: Dispatch<SetStateAction<Record<string, unknown>>>
  params: Record<string, unknown>
  validate?: (ctx: ChangeContext<T, F>) => boolean
}>

export type EditorOptions<P = InputHTMLAttributes<HTMLInputElement>> = {
  inputProps?: P
}
