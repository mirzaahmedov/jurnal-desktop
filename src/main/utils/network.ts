import os from 'os'

export const getVPNLocalIP = () => {
  const interfaces = os.networkInterfaces()

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        iface.address.startsWith('10.') // often VPNs use 10.x.x.x or 172.x.x.x
      ) {
        console.log(`VPN interface: ${name}`)
        return iface.address
      }
    }
  }
  return null
}
