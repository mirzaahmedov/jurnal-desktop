import type { ReactNode, HTMLAttributes, TdHTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'
import { GenericTableCell, GenericTableRow } from '@/common/components/generic-table'

export type FooterRowProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode
}
export const FooterRow = ({ children, className, ...props }: FooterRowProps) => {
  return (
    <GenericTableRow
      className={cn('pointer-events-none', className)}
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
      className={cn('last:border-solid', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        {title ? <b className="font-black">{title}</b> : null}
        <b className={cn('ml-auto text-right font-black', contentClassName)}>{content}</b>
      </div>
    </GenericTableCell>
  )
}
