import type { EditorComponent, EditorOptions } from './interfaces'

import { NumericInput, type NumericInputProps } from '@/common/components'
import { inputVariants } from '@/common/features/spravochnik'

export const createNumberEditor = <T extends object>({
  readOnly = false,
  key,
  max,
  inputProps,
  defaultValue
}: EditorOptions<T, NumericInputProps> & {
  readOnly?: boolean
  max?: number
  defaultValue?: number
}): EditorComponent<T> => {
  const EditorComponent: EditorComponent<T> = ({ tabIndex, inputRef, errors, value, onChange }) => {
    return (
      <div className="relative">
        <NumericInput
          getInputRef={inputRef}
          readOnly={readOnly}
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
