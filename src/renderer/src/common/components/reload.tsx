import { RotateCw } from 'lucide-react'
import { Trans } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'

export const Reload = () => {
  return (
    <Button
      variant="ghost"
      className="rounded-none"
      onPress={() => {
        window.location.reload()
      }}
    >
      <RotateCw className="btn-icon icon-start" /> <Trans>reload</Trans>
    </Button>
  )
}
