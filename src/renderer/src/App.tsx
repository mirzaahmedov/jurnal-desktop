import { Suspense, useEffect } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
// import { createPortal } from 'react-dom'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { router } from './app/router'
import { LoadingOverlay } from './common/components'
import { Toaster } from './common/components/ui/toaster'
import { ConfirmationDialog } from './common/features/confirm'
import { initLocales } from './common/features/locales'
import { SpravochnikProvider } from './common/features/spravochnik'
import { UpdateManager } from './common/features/update-manager'
import { queryClient } from './common/lib/query-client'

initLocales()

// const ToastProvider = () => {
//   return createPortal(
//     <ToastContainer
//       position="bottom-right"
//       toastStyle={{
//         width: 400
//       }}
//     />,
//     document.getElementById('toasts')!
//   )
// }

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
      <ToastContainer
        position="bottom-right"
        toastStyle={{
          width: 400
        }}
      />
      <ConfirmationDialog />
      <UpdateManager />
    </QueryClientProvider>
  )
}

export default App
