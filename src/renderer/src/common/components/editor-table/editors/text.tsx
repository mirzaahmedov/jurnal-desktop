import { Controller } from 'react-hook-form'

import { cn } from '@/common/lib/utils'

import { createEditor, inputVariants } from './utils'

export const textEditor = createEditor(
  ({
    form,
    arrayField,
    originalIndex,
    colDef,
    disabled,
    readOnly,
    className,
    inputRef,
    ...props
  }) => (
    <Controller
      name={`${arrayField}.${originalIndex}.${colDef?.field}`}
      control={form.control}
      render={({ field }) => (
        <input
          {...props}
          {...field}
          className={cn(inputVariants(), className)}
          disabled={disabled}
          readOnly={readOnly}
          ref={(e) => {
            if (e) inputRef.current = e
            field.ref(e)
          }}
        />
      )}
    />
  )
)
