import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ConfirmationDialog } from './common/features/confirm'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { RouterProvider } from 'react-router-dom'
import { Spravochnik } from './common/features/spravochnik'
import { ToastContainer } from 'react-toastify'
import { Toaster } from './common/components/ui/toaster'
import { UpdateManager } from './common/features/update-manager'
import { router } from './app/router'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  }
})

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
      <NuqsAdapter>
        <RouterProvider router={router} />
        <Spravochnik />
        <Toaster />
        <ToastContainer position="bottom-right" />
        <ConfirmationDialog />
      </NuqsAdapter>
      <UpdateManager />
    </QueryClientProvider>
  )
}

export default App
