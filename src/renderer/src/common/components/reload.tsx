import { RotateCw } from 'lucide-react'

import { Button } from '@/common/components/jolly/button'

export const Reload = () => {
  return (
    <Button
      size="icon"
      variant="ghost"
      onPress={() => window.location.reload()}
    >
      <RotateCw className="btn-icon icon-md" />
    </Button>
  )
}
