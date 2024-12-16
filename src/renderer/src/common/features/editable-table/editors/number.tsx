import type { EditorComponentType } from './types'

import { inputVariants, NumericInput } from '@/common/components'

const createNumberEditor = <T extends Record<string, unknown>>({
  readOnly = false,
  key
}: {
  readOnly?: boolean
  key: keyof T
}): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    return (
      <div className="relative">
        <NumericInput
          readOnly={readOnly}
          name={key as string}
          tabIndex={tabIndex}
          value={
            typeof row[key] === 'string' || typeof row[key] === 'number'
              ? Number(row[key]) !== 0
                ? Number(row[key])
                : ''
              : ''
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
        />
      </div>
    )
  }
}

export { createNumberEditor }
