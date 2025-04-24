import { useEffect } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { RotateCw } from 'lucide-react'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { router } from './app/router'
import { Button } from './common/components/ui/button'
import { Toaster } from './common/components/ui/toaster'
import { ConfirmationDialog } from './common/features/confirm'
import { initLocales } from './common/features/languages'
import { UpdateManager } from './common/features/update-manager'
import { queryClient } from './common/lib/query-client'

initLocales()

function App() {
  useEffect(() => {
    requestAnimationFrame(() => {
      document.getElementById('splash-screen')?.classList.add('hidden')
    })
  }, [])
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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <ToastContainer
        position="bottom-right"
        toastStyle={{
          width: 400,
          pointerEvents: 'auto'
        }}
      />
      <ConfirmationDialog />
      <UpdateManager />

      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-5 right-5 z-100"
        onClick={() => {
          window.location.reload()
        }}
      >
        <RotateCw className="btn-icon" />
      </Button>
    </QueryClientProvider>
  )
}

export default App
