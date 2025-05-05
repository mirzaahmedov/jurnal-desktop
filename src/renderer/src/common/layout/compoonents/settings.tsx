import { SettingsIcon } from 'lucide-react'

import { Button } from '@/common/components/jolly/button'
import { SettingsDialog } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'

export const Settings = () => {
  const settingsToggle = useToggle()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onPress={settingsToggle.open}
      >
        <SettingsIcon className="btn-icon icon-md" />
      </Button>
      <SettingsDialog
        open={settingsToggle.isOpen}
        onOpenChange={settingsToggle.setOpen}
      />
    </>
  )
}
