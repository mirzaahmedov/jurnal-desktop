import type { FieldsetProps } from '@/common/components'
import type { UseSpravochnikReturn } from '@/common/features/spravochnik'
import type { HTMLAttributes, RefObject } from 'react'
import type { FieldError, FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form'

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
  TypeElement = HTMLInputElement,
  TypeProps = {}
> = (props: FormFieldsComponentProps<TypeData, TypeElement> & TypeProps) => JSX.Element

// -----------------------------------------------------------------------------
// Form Editable Fields Components
// -----------------------------------------------------------------------------

type FormEditableFieldsComponentProps<T extends FieldValues> = Omit<
  FieldsetProps,
  'form' | 'name'
> & {
  tabIndex?: number
  disabled?: boolean
  dialog?: boolean
  name?: string
  form: UseFormReturn<T>
  containerProps?: HTMLAttributes<HTMLDivElement>
}
type FormEditableFieldsComponent<
  TypeRequired extends FieldValues,
  TProps extends Record<string, unknown> = {}
> = <TypePayload extends TypeRequired>(
  props: FormEditableFieldsComponentProps<TypePayload> & TProps
) => JSX.Element

// -----------------------------------------------------------------------------
// Form Spravochnik Fields Components
// -----------------------------------------------------------------------------

type FormSpravochnikFieldsComponentProps<T> = Omit<FieldsetProps, 'name'> & {
  tabIndex?: number
  disabled?: boolean
  error?: FieldError
  name?: string
  dialog?: boolean
  spravochnik: UseSpravochnikReturn<T>
  containerProps?: HTMLAttributes<HTMLDivElement>
}
type FormSpravochnikFieldsComponent<
  T extends Record<string, unknown>,
  P = Record<string, unknown>
> = (props: Omit<FormSpravochnikFieldsComponentProps<T>, 'form'> & P) => JSX.Element

export type {
  FormFieldsComponentProps,
  FormFieldsComponent,
  FormEditableFieldsComponentProps,
  FormEditableFieldsComponent,
  FormSpravochnikFieldsComponentProps,
  FormSpravochnikFieldsComponent
}
