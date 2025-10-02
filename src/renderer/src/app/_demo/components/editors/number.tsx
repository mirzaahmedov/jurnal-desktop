import { Controller } from 'react-hook-form'

import { NumericInput } from '@/common/components'
import { cn } from '@/common/lib/utils'

import { createEditor, inputVariants } from './utils'

export const numberEditor = createEditor(
  ({
    form,
    arrayField,
    originalIndex,
    colDef,
    disabled,
    readOnly,
    className,
    context,
    inputRef,
    ...props
  }) => {
    return (
      <Controller
        name={`${arrayField}.${originalIndex}.${colDef?.field}`}
        control={form.control}
        render={({ field }) => (
          <NumericInput
            {...props}
            {...field}
            customInput={undefined}
            value={field.value ?? 0}
            onChange={undefined}
            onValueChange={(values, event) => {
              field.onChange(values.value ?? 0)
              if (event.source === 'event') {
                context?.onValueEdited?.(originalIndex, colDef?.field)
              }
            }}
            className={cn(inputVariants(), className)}
            disabled={disabled}
            readOnly={readOnly}
            ref={(el) => {
              if (el) inputRef.current = el
              field.ref(el)
            }}
          />
        )}
      />
    )
  }
)
