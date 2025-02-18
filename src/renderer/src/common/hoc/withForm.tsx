import type { ComponentType } from 'react'
import type { FieldValues, UseFormRegister, UseFormReturn } from 'react-hook-form'

export interface WithFormProps<FormType, RequiredFields> {
  form: FormType extends { register: UseFormRegister<infer FieldsType> }
    ? FieldsType extends RequiredFields
      ? FormType
      : never
    : never
}

export const withForm = <RequiredFields extends FieldValues, ComponentProps = {}>(
  Component: ComponentType<
    {
      form: UseFormReturn<RequiredFields>
    } & ComponentProps
  >
) => {
  return <T extends UseFormReturn<any>>({
    form,
    ...props
  }: ComponentProps & WithFormProps<T, RequiredFields>) => {
    return (
      <Component
        {...(props as ComponentProps)}
        form={form as UseFormReturn<RequiredFields>}
      />
    )
  }
}
