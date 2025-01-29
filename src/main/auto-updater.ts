const events = {
  checking_for_update: 'checking-for-update',
  update_available: 'update-available',
  download_progress: 'download-progress',
  update_downloaded: 'update-downloaded',
  update_downloaded_silent: 'update_downloaded_silent',
  update_cancelled: 'update-cancelled',
  update_not_available: 'update-not-available',
  login: 'login',
  error: 'error'
} as const

export { events }
