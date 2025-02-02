import type { SpravochnikInputProps } from './input'
import type { FormElementProps } from '@/common/components/form'
import type { Ref } from 'react'

import { FormElement } from '@/common/components/form'

import { SpravochnikInput } from './input'

type SpravochnikFieldProps<T> = SpravochnikInputProps<T> & {
  label: string
  error?: boolean
  formElementProps?: Omit<FormElementProps, 'label'>
  inputRef?: Ref<HTMLInputElement>
  customInput?: React.ReactNode
}
const SpravochnikField = <T extends Record<string, unknown>>({
  label,
  formElementProps,
  inputRef,
  customInput,
  error,
  ...props
}: SpravochnikFieldProps<T>) => {
  return (
    <FormElement
      {...formElementProps}
      error={error}
      label={label}
    >
      {customInput ? (
        customInput
      ) : (
        <SpravochnikInput
          inputRef={inputRef}
          error={error}
          {...props}
        />
      )}
    </FormElement>
  )
}

export { SpravochnikField }
