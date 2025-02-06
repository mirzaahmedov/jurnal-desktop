import { Suspense, useEffect } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { router } from './app/router'
import { LoadingOverlay } from './common/components'
import { Toaster } from './common/components/ui/toaster'
import { ConfirmationDialog } from './common/features/confirm'
import { initLocales } from './common/features/locales'
import { SpravochnikProvider } from './common/features/spravochnik'
import { UpdateManager } from './common/features/update-manager'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  }
})

initLocales()

function App() {
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
      <Suspense fallback={<LoadingOverlay />}>
        <RouterProvider router={router} />
      </Suspense>
      <SpravochnikProvider />
      <Toaster />
      <ToastContainer position="bottom-right" />
      <ConfirmationDialog />
      <UpdateManager />
    </QueryClientProvider>
  )
}

export default App
