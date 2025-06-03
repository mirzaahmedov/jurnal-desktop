import fs from 'fs'
import os from 'os'
import path from 'path'

class Logger {
  private logPath: string
  private logStream: fs.WriteStream | null = null

  constructor() {
    // Create logs directory in user's home directory
    const logsDir = path.join(os.homedir(), 'E-Moliya', 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // Create log file with current date
    const date = new Date().toISOString().split('T')[0]
    this.logPath = path.join(logsDir, `${date}.log`)
    this.initStream()
  }

  private initStream() {
    this.logStream = fs.createWriteStream(this.logPath, { flags: 'a' })
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    let logMessage = `[${timestamp}] [${level}] ${message}`

    if (meta) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`
    }

    return logMessage + '\n'
  }

  info(message: string, meta?: any) {
    const formattedMessage = this.formatMessage('INFO', message, meta)
    this.logStream?.write(formattedMessage)
    console.log(formattedMessage)
  }

  error(message: string, meta?: any) {
    const formattedMessage = this.formatMessage('ERROR', message, meta)
    this.logStream?.write(formattedMessage)
    console.error(formattedMessage)
  }

  warn(message: string, meta?: any) {
    const formattedMessage = this.formatMessage('WARN', message, meta)
    this.logStream?.write(formattedMessage)
    console.warn(formattedMessage)
  }

  debug(message: string, meta?: any) {
    const formattedMessage = this.formatMessage('DEBUG', message, meta)
    this.logStream?.write(formattedMessage)
    console.debug(formattedMessage)
  }

  close() {
    this.logStream?.end()
  }
}

export const logger = new Logger()
