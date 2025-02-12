import type { EditorComponentType } from './types'

import { inputVariants } from '@renderer/common/features/spravochnik'

import { Input } from '@/common/components/ui/input'
import { cn } from '@/common/lib/utils'

const createTextEditor = <T extends Record<string, unknown>>({
  readOnly = false,
  disabled = false,
  key
}: {
  readOnly?: boolean
  disabled?: boolean
  key: keyof T
}): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange }) => {
    return (
      <div className="relative">
        <Input
          readOnly={readOnly}
          disabled={disabled}
          name={key as string}
          tabIndex={tabIndex}
          value={typeof row[key] === 'string' || typeof row[key] === 'number' ? row[key] : ''}
          onChange={(e) =>
            onChange?.({
              id,
              key,
              payload: {
                ...row,
                [key]: e.target.value ?? ''
              }
            })
          }
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

export { createTextEditor }
