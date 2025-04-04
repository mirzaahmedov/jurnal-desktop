import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { CheckIcon } from '@/common/assets/icons/check'
import { cn } from '@/common/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-5 shrink-0 rounded-sm border border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground data-[state=checked]:border-brand hover:bg-slate-100 transition-colors',
      props.checked === 'indeterminate' &&
        'bg-brand text-brand-foreground border-brand hover:bg-brand',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      {props.checked === 'indeterminate' ? (
        <span className="h-[3px] w-3/5 rounded bg-current" />
      ) : (
        <CheckIcon className="size-2.5" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
