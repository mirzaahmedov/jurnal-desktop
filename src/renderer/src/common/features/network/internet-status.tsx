import { useEffect, useState } from 'react'

import { Trans } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'

export const InternetStatus = () => {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const ping = async () => {
      const online = await window.api.pingInternet()
      console.log({ online })
      setIsOnline(online)
    }

    const interval = setInterval(ping, 5000)

    ping()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2"
    >
      <div className="relative">
        <span className={`block size-3 rounded-full ${isOnline ? 'bg-red-500' : 'bg-green-500'}`} />
        {isOnline && (
          <span className="absolute top-0 left-0 size-3 rounded-full bg-red-500 opacity-75 animate-ping" />
        )}
      </div>
      <span className="text-sm font-medium">
        {isOnline ? <Trans>turn_off_internet</Trans> : <Trans>no_internet</Trans>}
      </span>
    </Button>
  )
}
