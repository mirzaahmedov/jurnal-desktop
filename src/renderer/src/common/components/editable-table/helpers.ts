import type { UseFormReturn } from 'react-hook-form'
import type { ZodSchema } from 'zod'

export const createEditorCreateHandler =
  ({
    form,
    defaultValues,
    field = 'childs'
  }: {
    schema: ZodSchema<any>
    form: UseFormReturn<any>
    defaultValues: any
    field?: string
  }) =>
  () => {
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
    form.setValue(
      field,
      (form.getValues(field) as []).map((value, index) => {
        if (index === id) {
          return payload
        }
        return value
      })
    )
    form.trigger(`${field}.${id}.${key as any}` as any)
  }
