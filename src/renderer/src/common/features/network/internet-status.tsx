import { useEffect, useState } from 'react'

import { Trans } from 'react-i18next'

export const InternetStatus = () => {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const ping = async () => {
      setIsOnline(await window.api.pingInternet())
    }

    const interval = setInterval(ping, 2000)

    ping()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 px-5 py-2">
      <div className="relative">
        <span className={`block size-3 rounded-full ${isOnline ? 'bg-red-500' : 'bg-green-500'}`} />
        {isOnline && (
          <span className="absolute top-0 left-0 size-3 rounded-full bg-red-500 opacity-75 animate-ping" />
        )}
      </div>
      <span className="text-sm font-medium text-slate-500">
        {isOnline ? <Trans>turn_off_internet</Trans> : <Trans>no_internet</Trans>}
      </span>
    </div>
  )
}
