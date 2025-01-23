import type { UseFormReturn } from 'react-hook-form'
import type { ZodSchema } from 'zod'
import { focusInvalidInput } from '@renderer/common/lib/errors'

const createEditorCreateHandler =
  ({
    schema,
    form,
    defaultValues
  }: {
    schema: ZodSchema<any>
    form: UseFormReturn<any>
    defaultValues: any
  }) =>
  () => {
    for (const [index, row] of form.getValues('childs').entries()) {
      const validation = schema.safeParse(row)
      if (!validation.success) {
        console.log('validation failed for podvodka', index, validation.error)
        form.trigger('childs').then(() => {
          focusInvalidInput()
        })
        return
      }
    }

    form.setValue('childs', [...form.getValues('childs'), defaultValues])
  }

const createEditorDeleteHandler =
  ({ form }: { form: UseFormReturn<any> }) =>
  ({ id }: { id: number }) => {
    if (form.getValues('childs').length === 1) {
      return
    }
    form.setValue(
      'childs',
      (form.getValues('childs') as []).filter((_, index) => index !== id)
    )
  }

const createEditorChangeHandler =
  ({ form }: { form: UseFormReturn<any> }) =>
  ({ id, key, payload }: { id: number; key: any; payload: any }) => {
    form.setValue(
      'childs',
      (form.getValues('childs') as []).map((value, index) => {
        if (index === id) {
          return payload
        }
        return value
      })
    )
    form.trigger(`childs.${id}.${key as any}` as any)
  }

export { createEditorCreateHandler, createEditorDeleteHandler, createEditorChangeHandler }
