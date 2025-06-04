import type { UseFormReturn } from 'react-hook-form'
import type { ZodSchema } from 'zod'

export const createEditorCreateHandler =
  ({
    form,
    defaultValues,
    field = 'childs'
  }: {
    schema?: ZodSchema<any>
    form: UseFormReturn<any>
    defaultValues: any
    field?: string
  }) =>
  () => {
    console.log({ defaultValues, field })
    form.setValue(field, [...form.getValues(field), defaultValues])
  }

export const createEditorDeleteHandler =
  ({ form, field = 'childs' }: { form: UseFormReturn<any>; field?: string }) =>
  ({ id }: { id: number }) => {
    form.setValue(
      field,
      (form.getValues(field) as []).filter((_, index) => index !== id)
    )
  }

export const createEditorChangeHandler =
  ({ form, field = 'childs' }: { form: UseFormReturn<any>; field?: string }) =>
  ({ id, key, payload }: { id: number; key: any; payload: any }) => {
    form.setValue(`${field}.${id}.${key}` as any, payload[key])
  }

export const createEditorDuplicateHandler =
  ({ form, field = 'childs' }: { form: UseFormReturn<any>; field?: string }) =>
  ({ index, row, rows }: { index: number; row: any; rows: any[] }) => {
    console.log({ rows, row, index })
    form.setValue(field, [...rows.slice(0, index + 1), { ...row }, ...rows.slice(index + 1)])
  }
