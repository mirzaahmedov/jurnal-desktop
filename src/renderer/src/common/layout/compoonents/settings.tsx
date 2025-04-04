import { SettingsIcon } from 'lucide-react'

import { Button } from '@/common/components/ui/button'
import { SettingsDialog } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'

export const Settings = () => {
  const settingsToggle = useToggle()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={settingsToggle.open}
      >
        <SettingsIcon />
      </Button>
      <SettingsDialog
        open={settingsToggle.isOpen}
        onOpenChange={settingsToggle.setOpen}
      />
    </>
  )
}
