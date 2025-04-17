import type { User } from '@/common/models'

import { Trans, useTranslation } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { Avatar, AvatarFallback } from '@/common/components/ui/avatar'

export interface UserProfileProps {
  user: User
}
export const UserProfile = ({ user }: UserProfileProps) => {
  const { t } = useTranslation()
  return (
    <PopoverTrigger>
      <Button
        size="icon"
        variant="ghost"
        className="size-auto p-1 rounded-full"
      >
        <Avatar>
          <AvatarFallback className="bg-brand text-brand-foreground">
            {user.fio
              ?.split(' ')
              .filter((w) => Boolean(w?.trim()))
              .slice(0, 2)
              .map((w) => w?.[0]?.toUpperCase())}
          </AvatarFallback>
        </Avatar>
      </Button>
      <Popover placement="bottom right">
        <PopoverDialog className="w-[22.5rem] p-8">
          <div className="flex flex-col items-center">
            <Avatar className="text-2xl !size-16">
              <AvatarFallback className="bg-brand text-brand-foreground">
                {user.fio
                  ?.split(' ')
                  .filter((w) => Boolean(w?.trim()))
                  .slice(0, 2)
                  .map((w) => w?.[0]?.toUpperCase())}
              </AvatarFallback>
            </Avatar>
            <h6 className="text-xl text-center font-semibold mt-2">{user.fio}</h6>
            <DataList
              className="mt-4 w-full"
              list={[
                {
                  name: <Trans>login</Trans>,
                  value: user.login
                },
                {
                  name: <Trans>region</Trans>,
                  value: user.region_name
                },
                {
                  name: <Trans>role</Trans>,
                  value: user.role_name === 'region-admin' ? t('region_admin') : user.role_name
                }
              ]}
            />
          </div>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
