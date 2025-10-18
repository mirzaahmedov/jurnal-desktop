import { useEffect } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { router } from './app/router'
import { ApplicationUpdateManager } from './common/features/application-update-manager'
import { useAuthStore } from './common/features/auth'
import { ConfirmationDialog } from './common/features/confirm'
import { SendFeedbackModal } from './common/features/feedback/SendFeedbackModal'
import { initLocales } from './common/features/languages'
import { queryClient } from './common/lib/query-client'

initLocales()

function App() {
  const setUser = useAuthStore((store) => store.setUser)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'I' && e.shiftKey && e.ctrlKey) {
        window.electron.ipcRenderer.send('open-dev-tools')
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.on('usb-device-detached', () => {
      console.log('usb-device-detached')
      setUser(null)
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        toastClassName="toast-container"
        toastStyle={{
          width: 400,
          pointerEvents: 'auto'
        }}
      />
      <ConfirmationDialog />
      <ApplicationUpdateManager />
      <SendFeedbackModal />
    </QueryClientProvider>
  )
}

export default App
