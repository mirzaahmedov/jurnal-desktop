import { RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'
import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'

export const RefreshPage = () => {
  const { t } = useTranslation(['app'])
  return (
    <TooltipTrigger delay={300}>
      <Button
        size="icon"
        variant="ghost"
        onPress={() => window.location.reload()}
      >
        <RotateCw className="btn-icon icon-md" />
      </Button>
      <Tooltip>{t('app.refresh_page')}</Tooltip>
    </TooltipTrigger>
  )
}
