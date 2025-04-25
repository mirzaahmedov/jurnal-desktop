import type { EditorComponent } from './interfaces'

import { NumericInput } from '@/common/components'
import { inputVariants } from '@/common/features/spravochnik'

export const createSummaEditor = <T extends object>(): EditorComponent<T, any> => {
  return ({ column, tabIndex, value, error, onChange }) => {
    return (
      <div className="relative">
        <NumericInput
          name={String(column.key)}
          tabIndex={tabIndex}
          allowNegative={false}
          value={(value as number | undefined) || ''}
          onValueChange={(values) => onChange?.(values.floatValue ?? 0)}
          error={!!error}
          className={inputVariants({ editor: true, error: !!error })}
          autoComplete="off"
        />
      </div>
    )
  }
}
