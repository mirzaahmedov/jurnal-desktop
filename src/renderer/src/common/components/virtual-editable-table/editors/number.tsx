import type { EditorComponent, EditorOptions } from './interfaces'
import type { ComponentProps } from 'react'

import { NumericInput, type NumericInputProps } from '@/common/components'
import { inputVariants } from '@/common/features/spravochnik'

export const createNumberEditor = <T extends object>({
  readOnly: readOnlyColumn = false,
  key,
  max,
  inputProps,
  defaultValue,
  isReadOnly
}: EditorOptions<T, NumericInputProps> & {
  readOnly?: boolean
  max?: number
  defaultValue?: number
  isReadOnly?: (props: ComponentProps<EditorComponent<T, any>>) => boolean
}): EditorComponent<T, any> => {
  const EditorComponent: EditorComponent<T, any> = (props) => {
    const { tabIndex, inputRef, errors, readOnly: readOnlyTable, value, onChange } = props

    const readOnly = readOnlyTable || readOnlyColumn
    return (
      <div className="relative">
        <NumericInput
          ref={inputRef}
          readOnly={readOnly || isReadOnly?.(props)}
          name={key as string}
          tabIndex={tabIndex}
          isAllowed={(values) => {
            if (max) {
              return (values.floatValue ?? 0) <= max
            }
            return true
          }}
          value={
            typeof value === 'string' || typeof value === 'number'
              ? Number(value) !== 0
                ? Number(value)
                : (defaultValue ?? '')
              : (defaultValue ?? '')
          }
          onValueChange={(values) => onChange?.(values.floatValue ?? 0)}
          error={!!errors?.[key as string]}
          className={inputVariants({
            editor: true,
            error: !!errors?.[key as string]
          })}
          autoComplete="off"
          {...inputProps}
        />
      </div>
    )
  }
  return EditorComponent
}
