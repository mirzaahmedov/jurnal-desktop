import type { UpdaterEvents } from 'electron-updater'

const events = {
  checking_for_update: 'checking-for-update',
  update_available: 'update-available',
  download_progress: 'download-progress',
  update_downloaded: 'update-downloaded',
  update_cancelled: 'update-cancelled',
  update_not_available: 'update-not-available',
  login: 'login',
  error: 'error'
} as const satisfies Record<string, UpdaterEvents>

export { events }
