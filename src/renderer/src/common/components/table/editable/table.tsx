import type { TableHTMLAttributes, TdHTMLAttributes } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'
import { Button, ButtonProps } from '@/common/components/ui/button'
import { Plus } from 'lucide-react'

export type EditableTableProps = TableHTMLAttributes<HTMLTableElement> & {}
export const EditableTable = (props: EditableTableProps) => {
  const { children, className, ...rest } = props
  return (
    <Table
      className={cn('border-collapse h-full border border-y-gray-200 bg-white', className)}
      {...rest}
    >
      {children}
    </Table>
  )
}

export type EditableTableHeaderProps = TableHTMLAttributes<HTMLTableSectionElement> & {}
export const EditableTableHeader = (props: EditableTableHeaderProps) => {
  const { children, className, ...rest } = props
  return (
    <TableHeader
      className={cn('bg-slate-50 divide-x divide-gray-200', className)}
      {...rest}
    >
      {children}
    </TableHeader>
  )
}

export type EditableTableRowProps = TableHTMLAttributes<HTMLTableRowElement> & {}
export const EditableTableRow = (props: EditableTableRowProps) => {
  const { children, ...rest } = props
  return <TableRow {...rest}>{children}</TableRow>
}

export type EditableTableHeadProps = TableHTMLAttributes<HTMLTableCellElement> & {}
export const EditableTableHead = (props: EditableTableHeadProps) => {
  const { children, className, ...rest } = props
  return (
    <TableHead
      className={cn('px-2.5 py-3', className)}
      {...rest}
    >
      {children}
    </TableHead>
  )
}

export type EditableTableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {}
export const EditableTableCell = (props: EditableTableCellProps) => {
  const { children, ...rest } = props
  return <TableCell {...rest}>{children}</TableCell>
}

export type EditableTableBodyProps = TableHTMLAttributes<HTMLTableSectionElement> & {}
export const EditableTableBody = (props: EditableTableBodyProps) => {
  const { children, ...rest } = props
  return <TableBody {...rest}>{children}</TableBody>
}

export type EditableTableCreateRowProps = Omit<ButtonProps, 'children'> & {}
export const EditableTableCreateRow = (props: EditableTableCreateRowProps) => {
  return (
    <EditableTableRow>
      <EditableTableCell colSpan={100}>
        <Button
          variant="ghost"
          type="submit"
          className="w-full"
          {...props}
        >
          <Plus className="btn-icon" /> Добавить
        </Button>
      </EditableTableCell>
    </EditableTableRow>
  )
}
