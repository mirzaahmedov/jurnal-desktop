import type { User } from '@/common/models'

import { Avatar, AvatarFallback } from '@/common/components/ui/avatar'
import { Button } from '@/common/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'

export interface UserProfileProps {
  user: User
}
export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="px-2.5 flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <PopoverContent align="end">
          <div className="flex flex-col gap-0.5">
            <h6 className="text-base font-semibold">{user.fio}</h6>
            <p className="text-xs font-medium text-slate-500">
              {[
                user.region_name,
                user.role_name === 'region-admin' ? 'Регион админ' : user.role_name
              ].join(' - ')}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
