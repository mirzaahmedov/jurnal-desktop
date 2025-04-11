import type { EditorComponent } from './interfaces'

import { Input } from '@/common/components/ui/input'
import { inputVariants } from '@/common/features/spravochnik'
import { cn } from '@/common/lib/utils'

export const createTextEditor = <T extends object>({
  readOnly = false,
  disabled = false,
  key,
  defaultValue
}: {
  readOnly?: boolean
  disabled?: boolean
  key: keyof T
  defaultValue?: string
}): EditorComponent<T> => {
  return ({ tabIndex, value, errors, onChange }) => {
    return (
      <div className="relative">
        <Input
          readOnly={readOnly}
          disabled={disabled}
          name={key as string}
          tabIndex={tabIndex}
          value={
            typeof value === 'string' || typeof value === 'number' ? value : (defaultValue ?? '')
          }
          onChange={(e) => onChange?.(e.target.value)}
          error={!!errors?.[key as string]}
          className={cn(
            inputVariants({
              editor: true,
              error: !!errors?.[key as string]
            }),
            'disabled:opacity-100 disabled:ring-0 disabled:focus-visible:ring-0 disabled:outline-none'
          )}
          autoComplete="off"
        />
      </div>
    )
  }
}
