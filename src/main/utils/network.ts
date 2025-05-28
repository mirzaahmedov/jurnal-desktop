import os from 'os'

export const getVPNLocalIP = () => {
  const interfaces = os.networkInterfaces()

  console.log('Network interfaces:', interfaces)

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return null
}
