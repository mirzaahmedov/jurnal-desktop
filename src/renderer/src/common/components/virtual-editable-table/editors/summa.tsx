import type { EditorComponent } from './interfaces'

import { NumericInput } from '@/common/components'
import { inputVariants } from '@/common/features/spravochnik'

export const createSummaEditor = <T extends { summa?: number }>(): EditorComponent<T> => {
  return ({ tabIndex, value, errors, onChange }) => {
    return (
      <div className="relative">
        <NumericInput
          name="summa"
          tabIndex={tabIndex}
          allowNegative={false}
          value={(value as number | undefined) || ''}
          onValueChange={(values) => onChange?.(values.floatValue ?? 0)}
          error={!!errors?.summa}
          className={inputVariants({ editor: true, error: !!errors?.summa })}
          autoComplete="off"
        />
      </div>
    )
  }
}
