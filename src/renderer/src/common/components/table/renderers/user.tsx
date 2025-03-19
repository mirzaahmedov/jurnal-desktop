import { HoverInfoCell } from './hover-info'

export interface UserCellProps {
  fio: string
  login: string
}
export const UserCell = ({ fio, login }: UserCellProps) => {
  return (
    <HoverInfoCell
      title={fio}
      secondaryText={`@${login}`}
    />
  )
}
