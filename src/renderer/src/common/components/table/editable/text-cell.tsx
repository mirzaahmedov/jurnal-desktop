import type { FieldError } from 'react-hook-form'
import type { InputProps } from '@/common/components/ui/input'

import { TableCell } from '@/common/components/ui/table'
import { Input } from '@/common/components/ui/input'
import { NumericInput } from '@/common/components'
import { MousePointerClick } from 'lucide-react'
import { cn } from '@/common/lib/utils'

export type EditableTextCellProps<T extends boolean> = Omit<InputProps, 'value' | 'onChange'> & {
  numeric?: T
  error?: FieldError
  value?: number | string
  onChange?: (value: number | string) => void
}
export const EditableTextCell = <T extends boolean>(props: EditableTextCellProps<T>) => {
  const { className, error, numeric, ...restProps } = props
  return (
    <TableCell className="relative p-0 border-r border-slate-200 last:border-none">
      {numeric ? (
        <NumericInput
          className={cn(
            'w-full h-full px-2.5 py-1.5 font-medium bg-transparent text-slate-800 rounded-none border-none shadow-none appearance-none focus-visible:ring-2 ring-blue-500',
            error && 'bg-red-50 ring-2 focus-visible:ring-destructive ring-destructive',
            props.onDoubleClick && 'cursor-pointer',
            className
          )}
          title={restProps.value?.toString()}
          {...restProps}
          value={restProps.value?.toString()}
          onValueChange={(values) => {
            restProps.onChange?.(values.floatValue ?? 0)
          }}
          onChange={undefined}
          defaultValue={restProps.defaultValue?.toString()}
          type="text"
        />
      ) : (
        <Input
          readOnly
          className={cn(
            'w-full h-full px-2.5 py-1.5 font-medium bg-transparent text-slate-800 rounded-none border-none shadow-none appearance-none focus-visible:ring-2 ring-blue-500',
            error && 'bg-red-50 ring-2 focus-visible:ring-destructive ring-destructive',
            props.onDoubleClick && 'cursor-pointer',
            className
          )}
          title={restProps.value?.toString()}
          {...restProps}
          onChange={(e) => restProps.onChange?.(e.target.value)}
        />
      )}
      {props.onDoubleClick ? (
        <span className="absolute top-4 right-3 text-slate-500 pointer-events-none">
          <MousePointerClick className="btn-icon ml-0" />
        </span>
      ) : null}
    </TableCell>
  )
}
