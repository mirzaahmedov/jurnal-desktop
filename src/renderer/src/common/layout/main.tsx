import { Outlet } from 'react-router-dom'

import { AuthGuard } from '@/common/features/auth'
import { PageLayout } from '@/common/features/layout'

import { SpravochnikProvider } from '../features/spravochnik'
import Sidebar from './sidebar'

const MainLayout = () => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 overflow-auto scrollbar">
        <AuthGuard>
          <PageLayout>
            <Outlet />
          </PageLayout>
        </AuthGuard>
      </div>
      <SpravochnikProvider />
    </div>
  )
}

export default MainLayout
