import { SettingsIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'
import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'
import { SettingsDialog } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'

export const Settings = () => {
  const { t } = useTranslation(['app'])

  const settingsToggle = useToggle()

  return (
    <>
      <TooltipTrigger delay={300}>
        <Button
          variant="ghost"
          size="icon"
          onPress={settingsToggle.open}
        >
          <SettingsIcon className="btn-icon icon-md" />
        </Button>
        <Tooltip>{t('app.settings')}</Tooltip>
      </TooltipTrigger>
      <SettingsDialog
        open={settingsToggle.isOpen}
        onOpenChange={settingsToggle.setOpen}
      />
    </>
  )
}
