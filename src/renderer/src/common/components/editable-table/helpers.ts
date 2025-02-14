import type { UseFormReturn } from 'react-hook-form'
import type { ZodSchema } from 'zod'

import { focusInvalidInput } from '@renderer/common/lib/errors'

export const createEditorCreateHandler =
  ({
    schema,
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
    for (const [index, row] of form.getValues(field).entries()) {
      const validation = schema.safeParse(row)
      if (!validation.success) {
        console.log('validation failed for podvodka', index, validation.error)
        form.trigger(field).then(() => {
          focusInvalidInput()
        })
        return
      }
    }

    form.setValue(field, [...form.getValues(field), defaultValues])
  }

export const createEditorDeleteHandler =
  ({ form, field = 'childs' }: { form: UseFormReturn<any>; field?: string }) =>
  ({ id }: { id: number }) => {
    if (form.getValues(field).length === 1) {
      return
    }
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
