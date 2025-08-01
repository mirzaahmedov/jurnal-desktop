import { Trans } from 'react-i18next'

import { Copyable } from '@/common/components/copyable'
import { DataList } from '@/common/components/data-list'

import { HoverInfoCell } from './hover-info'

export interface UserCellProps {
  id: number
  fio: string
  login: string
}
export const UserCell = ({ id, fio, login }: UserCellProps) => {
  return (
    <HoverInfoCell
      title={fio}
      secondaryText={`@${login}`}
      tooltipContent={
        <DataList
          items={[
            {
              name: <Trans>id</Trans>,
              value: (
                <Copyable
                  side="start"
                  value={id}
                >
                  #{id}
                </Copyable>
              )
            },
            {
              name: <Trans>fio</Trans>,
              value: fio
            },
            {
              name: <Trans>login</Trans>,
              value: login
            }
          ]}
        />
      }
    />
  )
}
