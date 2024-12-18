import { TableCell } from '@/common/components/ui/table'
import { type ButtonProps, Button } from '@/common/components/ui/button'

export type EditableButtonCellProps = ButtonProps & {}
export const EditableButtonCell = (props: EditableButtonCellProps) => {
  const { children, ...restProps } = props
  return (
    <TableCell className="p-1 flex items-center justify-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        {...restProps}
      >
        {children}
      </Button>
    </TableCell>
  )
}
