import type { EditorComponent } from './interfaces'
import type { ArrayPath } from 'react-hook-form'

import { Input } from '@/common/components/ui/input'
import { inputVariants } from '@/common/features/spravochnik'
import { cn } from '@/common/lib/utils'

export const createTextEditor = <T extends object, F extends ArrayPath<T>>({
  readOnly = false,
  disabled = false,
  defaultValue
}: {
  readOnly?: boolean
  disabled?: boolean
  defaultValue?: string
}): EditorComponent<T, F> => {
  return ({ column, tabIndex, value, error, onChange }) => {
    return (
      <div className="relative">
        <Input
          title={value ? String(value) : undefined}
          readOnly={readOnly}
          disabled={disabled}
          name={String(column.key)}
          tabIndex={tabIndex}
          value={
            typeof value === 'string' || typeof value === 'number' ? value : (defaultValue ?? '')
          }
          onChange={(e) => onChange?.(e.target.value)}
          error={!!error}
          className={cn(
            inputVariants({
              editor: true,
              error: !!error
            }),
            'disabled:opacity-100 disabled:ring-0 disabled:focus-visible:ring-0 disabled:outline-none'
          )}
          autoComplete="off"
        />
      </div>
    )
  }
}
