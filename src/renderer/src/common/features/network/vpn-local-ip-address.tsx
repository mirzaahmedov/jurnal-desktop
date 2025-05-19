import { useEffect, useState } from 'react'

import { Trans } from 'react-i18next'

export const VPNLocalIPAddress = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  useEffect(() => {
    const handleUpdateIpAddress = async () => {
      setIpAddress(window.api.getVPNLocalIP())
    }

    window.addEventListener('online', handleUpdateIpAddress)
    window.addEventListener('offline', handleUpdateIpAddress)

    return () => {
      window.removeEventListener('online', handleUpdateIpAddress)
      window.removeEventListener('offline', handleUpdateIpAddress)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 px-5 py-2">
      <span className="text-sm font-medium text-slate-500">
        <b>IP</b>: {ipAddress ? ipAddress : <Trans>unknown</Trans>}
      </span>
    </div>
  )
}
