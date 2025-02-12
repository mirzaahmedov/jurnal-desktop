import { type ReactNode, useState } from 'react'

import { ClipboardCheck, ClipboardPlus } from 'lucide-react'

import { Button } from '@/common/components/ui/button'
import { cn } from '@/common/lib/utils'

type CopyableProps = {
  children: ReactNode
  value: string | number
  className?: string
  side?: 'start' | 'end'
}
export const Copyable = (props: CopyableProps) => {
  const { children, value, className, side = 'end' } = props

  const [isCopied, setCopied] = useState(false)

  return (
    <span
      className={cn(
        'group relative inline-flex items-center',
        side === 'end' && 'flex-row',
        side === 'start' && 'flex-row-reverse',
        className
      )}
    >
      {children}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'ml-1 align-middle invisible size-8 text-slate-400 transition-colors group-hover:visible',
          isCopied && 'visible text-brand hover:text-brand'
        )}
        onClick={(e) => {
          e.stopPropagation()
          window.navigator.clipboard.writeText(String(value))
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 5000)
        }}
      >
        {isCopied ? (
          <ClipboardCheck className="size-5 text-green-500" />
        ) : (
          <ClipboardPlus className="size-5" />
        )}
      </Button>
    </span>
  )
}
