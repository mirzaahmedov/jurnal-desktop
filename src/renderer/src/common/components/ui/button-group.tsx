import { cn } from '@/common/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

const buttonGroupVariants = cva('divide-x divide-dashed', {
  variants: {
    direction: {
      vertical: 'divide-y divide-dashed',
      horizontal: 'divide-x divide-dashed'
    },
    borderStyle: {
      none: 'divide-none',
      solid: 'divide-solid',
      dashed: 'divide-dashed',
      dotted: 'divide-dotted'
    }
  },
  defaultVariants: {
    direction: 'horizontal',
    borderStyle: 'none'
  }
})

const ButtonGroup = ({
  children,
  direction,
  borderStyle,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof buttonGroupVariants>) => {
  return (
    <div className={cn(buttonGroupVariants({ direction, borderStyle }), className)} {...props}>
      {children}
    </div>
  )
}
export { ButtonGroup, buttonGroupVariants }
