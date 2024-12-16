import type { HTMLAttributes, RefObject } from 'react'
import type { FieldError, FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form'
import type { FieldsetProps } from '@/common/components'
import { UseSpravochnikReturn } from '@/common/features/spravochnik'

// -----------------------------------------------------------------------------
// Form Fields Components
// -----------------------------------------------------------------------------

type FormFieldsComponentProps<TypeData extends Record<string, unknown>, TypeElement> = Omit<
  FieldsetProps,
  'name'
> & {
  tabIndex?: number
  disabled?: boolean
  triggerRef?: RefObject<TypeElement>
  name?: string
  errorMessages?: FieldErrors<TypeData>
  data?: TypeData
}
type FormFieldsComponent<
  TypeData extends Record<string, unknown>,
  TypeElement = HTMLInputElement
> = (props: FormFieldsComponentProps<TypeData, TypeElement>) => JSX.Element

// -----------------------------------------------------------------------------
// Form Editable Fields Components
// -----------------------------------------------------------------------------

type FormEditableFieldsComponentProps<T extends FieldValues> = Omit<
  FieldsetProps,
  'form' | 'name'
> & {
  tabIndex?: number
  disabled?: boolean
  name?: string
  form: UseFormReturn<T>
  containerProps?: HTMLAttributes<HTMLDivElement>
}
type FormEditableFieldsComponent<TypeRequired extends FieldValues> = <
  TypePayload extends TypeRequired
>(
  props: FormEditableFieldsComponentProps<TypePayload>
) => JSX.Element

// -----------------------------------------------------------------------------
// Form Spravochnik Fields Components
// -----------------------------------------------------------------------------

type FormSpravochnikFieldsComponentProps<T> = Omit<FieldsetProps, 'name'> & {
  tabIndex?: number
  disabled?: boolean
  error?: FieldError
  name?: string
  spravochnik: UseSpravochnikReturn<T>
}
type FormSpravochnikFieldsComponent<
  T extends Record<string, unknown>,
  P = Record<string, unknown>
> = (props: FormSpravochnikFieldsComponentProps<T> & P) => JSX.Element

export type {
  FormFieldsComponentProps,
  FormFieldsComponent,
  FormEditableFieldsComponentProps,
  FormEditableFieldsComponent,
  FormSpravochnikFieldsComponentProps,
  FormSpravochnikFieldsComponent
}
