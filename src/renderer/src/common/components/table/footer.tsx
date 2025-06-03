import { GenericTableCell, GenericTableRow } from '@/common/components/generic-table'
import type { HTMLAttributes, ReactNode, TdHTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'

export type FooterRowProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode
}
export const FooterRow = ({ children, className, ...props }: FooterRowProps) => {
  return (
    <GenericTableRow
      className={cn('pointer-events-none bg-white even:bg-white', className)}
      {...props}
    >
      {children}
    </GenericTableRow>
  )
}

export type FooterCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  title?: string
  content?: ReactNode
  contentClassName?: string
}
export const FooterCell = ({
  title,
  content,
  className,
  contentClassName,
  ...props
}: FooterCellProps) => {
  return (
    <GenericTableCell
      className={cn('last:border-solid py-3.5', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        {title ? <b className="font-black">{title}</b> : null}
        <b className={cn('ml-auto text-right font-black', contentClassName)}>{content}</b>
      </div>
    </GenericTableCell>
  )
}
