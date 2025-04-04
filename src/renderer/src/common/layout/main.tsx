import { Outlet } from 'react-router-dom'

import { AuthGuard } from '@/common/features/auth'
import { SpravochnikProvider } from '@/common/features/spravochnik'

import { Header } from './compoonents/header'
import { Sidebar } from './compoonents/sidebar'

const MainLayout = () => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 overflow-auto scrollbar">
        <AuthGuard>
          <main className="h-full flex flex-col bg-white">
            <Header />
            <Outlet />
          </main>
        </AuthGuard>
      </div>
      <SpravochnikProvider />
    </div>
  )
}

export default MainLayout
