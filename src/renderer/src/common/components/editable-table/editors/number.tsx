import type { EditorComponentType, EditorOptions } from './types'

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
}): EditorComponentType<T> => {
  const EditorComponent: EditorComponentType<T> = ({ tabIndex, id, row, errors, onChange }) => {
    return (
      <div className="relative">
        <NumericInput
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
            typeof row[key] === 'string' || typeof row[key] === 'number'
              ? Number(row[key]) !== 0
                ? Number(row[key])
                : (defaultValue ?? '')
              : (defaultValue ?? '')
          }
          onValueChange={(values) =>
            onChange?.({
              id,
              key,
              payload: {
                ...row,
                [key]: values.floatValue ?? 0
              }
            })
          }
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
