import { type InputHTMLAttributes, forwardRef } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/common/lib/utils'

const editorInputVariants = cva(
  'w-full h-full px-2 text-xs border-none outline-none bg-transparent'
)

export const EditorInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof editorInputVariants>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(editorInputVariants(), className)}
      {...props}
    />
  )
})
