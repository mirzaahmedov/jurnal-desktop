import type { HTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'

export type FieldsetProps = React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  name: string
  legendProps?: HTMLAttributes<HTMLLegendElement>
}
export const Fieldset = ({ name, className, children, legendProps, ...props }: FieldsetProps) => {
  return (
    <fieldset
      className={cn('flex flex-col gap-5 p-5 pb-7', className)}
      {...props}
    >
      <legend
        {...legendProps}
        className={cn('float-left text-xs font-bold text-slate-400', legendProps?.className)}
      >
        {name}
      </legend>
      {children}
    </fieldset>
  )
}
