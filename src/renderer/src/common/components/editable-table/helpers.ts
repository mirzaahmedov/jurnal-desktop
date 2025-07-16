import type { UseFormReturn } from 'react-hook-form'
import type { ZodSchema } from 'zod'
import type { CreateHandlerArgs, DeleteHandlerArgs, DuplicateHandlerArgs } from './interface'

export const createEditorCreateHandler =
  ({
    defaultValues,
  }: {
    schema?: ZodSchema<any>
    form: UseFormReturn<any>
    defaultValues: any
    field?: string
  }) =>
    ({ fieldArray }: CreateHandlerArgs<any, any>) => {
      fieldArray.append(defaultValues)
    }

export const createEditorDeleteHandler =
  (args: { form: UseFormReturn<any>; field?: string }) =>
    ({ id, fieldArray }: DeleteHandlerArgs<any, any>) => {
      console.log({ args })
      fieldArray.remove(id)
    }


export const createEditorDuplicateHandler =
  (args: { form: UseFormReturn<any>; field?: string }) =>
    ({ index, row, fieldArray }: DuplicateHandlerArgs<any, any>) => {
      console.log({ args })
      fieldArray.insert(index + 1, { ...row })
    }
