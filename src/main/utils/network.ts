import os from 'os'

export const getVPNLocalIP = () => {
  const interfaces = os.networkInterfaces()

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return null
}

export const isPingError = (stdout: string) => {
  return (
    stdout.toLowerCase().includes('Destination host unreachable'.toLowerCase()) ||
    stdout.toLowerCase().includes('Request timed out'.toLowerCase()) ||
    stdout.toLowerCase().includes('Ping request could not find host'.toLowerCase()) ||
    stdout.toLowerCase().includes('Удаленный узел недоступен'.toLowerCase()) ||
    stdout.toLowerCase().includes('Превышен интервал ожидания запроса.'.toLowerCase()) ||
    stdout.toLowerCase().includes('Не удается найти указанный узел'.toLowerCase())
  )
}
