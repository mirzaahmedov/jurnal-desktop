import { type ButtonHTMLAttributes, type ReactNode, useState } from 'react'

import { ClipboardCheck, ClipboardPlus } from 'lucide-react'

import { Button } from '@/common/components/ui/button'
import { cn } from '@/common/lib/utils'

type CopyableProps = {
  children: ReactNode
  value: string | number
  className?: string
  side?: 'start' | 'end'
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>
}
export const Copyable = ({
  children,
  value,
  className,
  side = 'end',
  buttonProps
}: CopyableProps) => {
  const [isCopied, setCopied] = useState(false)

  return (
    <span
      className={cn(
        'group/copyable relative inline-flex items-center gap-1',
        side === 'end' && 'flex-row',
        side === 'start' && 'flex-row-reverse',
        className
      )}
    >
      {children}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          window.navigator.clipboard.writeText(String(value))
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 5000)
        }}
        {...buttonProps}
        className={cn(
          'ml-1 align-middle invisible size-[1.5rem] text-slate-400 transition-colors group-hover/copyable:visible',
          isCopied && 'visible text-brand hover:text-brand',
          buttonProps?.className
        )}
      >
        {isCopied ? (
          <ClipboardCheck className="size-4 text-blue-600" />
        ) : (
          <ClipboardPlus className="size-4" />
        )}
      </Button>
    </span>
  )
}
