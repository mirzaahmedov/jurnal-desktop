import { useEffect, useState } from 'react'

import { Trans } from 'react-i18next'

import { Copyable } from '@/common/components'

export const VPNLocalIPAddress = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  useEffect(() => {
    const handleUpdateIpAddress = async () => {
      const ipAddress = await window.api.getVPNLocalIP()
      setIpAddress(ipAddress)
    }

    handleUpdateIpAddress()

    window.addEventListener('online', handleUpdateIpAddress)
    window.addEventListener('offline', handleUpdateIpAddress)

    return () => {
      window.removeEventListener('online', handleUpdateIpAddress)
      window.removeEventListener('offline', handleUpdateIpAddress)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 px-5 py-2">
      <span className="text-sm font-bold text-brand">
        <b>IP</b>:{' '}
        {ipAddress ? <Copyable value={ipAddress}>{ipAddress}</Copyable> : <Trans>unknown</Trans>}
      </span>
    </div>
  )
}
