import type { EditorComponent, EditorOptions } from './interfaces'

import { NumericInput, type NumericInputProps } from '@/common/components'
import { inputVariants } from '@/common/features/spravochnik'

export const createNumberEditor = <T extends object>({
  readOnly: readOnlyColumn = false,
  max,
  inputProps,
  defaultValue
}: EditorOptions<NumericInputProps> & {
  readOnly?: boolean
  max?: number
  defaultValue?: number
}): EditorComponent<T, any> => {
  const EditorComponent: EditorComponent<T, any> = ({
    readOnly: readOnlyTable,
    column,
    tabIndex,
    inputRef,
    error,
    value,
    onChange
  }) => {
    const readOnly = readOnlyTable || readOnlyColumn
    return (
      <div className="relative">
        <NumericInput
          ref={inputRef}
          readOnly={readOnly}
          name={column.key as string}
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
          error={!!error}
          className={inputVariants({
            editor: true,
            error: !!error
          })}
          autoComplete="off"
          {...inputProps}
        />
      </div>
    )
  }
  return EditorComponent
}
