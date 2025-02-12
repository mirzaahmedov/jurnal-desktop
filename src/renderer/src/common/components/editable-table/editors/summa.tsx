import type { EditorComponentType } from './types'

import { inputVariants } from '@renderer/common/features/spravochnik'

import { NumericInput } from '@/common/components'

export const createSummaEditor = <T extends { summa?: number }>(): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    return (
      <div className="relative">
        <NumericInput
          name="summa"
          tabIndex={tabIndex}
          allowNegative={false}
          value={row.summa || ''}
          onValueChange={(values) =>
            onChange?.({
              id,
              key: 'summa',
              payload: {
                ...row,
                summa: values.floatValue ?? 0
              }
            })
          }
          error={!!errors?.summa}
          className={inputVariants({ editor: true, error: !!errors?.summa })}
          autoComplete="off"
        />
      </div>
    )
  }
}
