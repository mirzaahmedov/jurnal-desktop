import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

import { KassaSaldoUpdateManager } from '@/app/jur_1/saldo/components/saldo-update-manager'
import { BankSaldoUpdateManager } from '@/app/jur_2/saldo/components/saldo-update-manager'
import { OrganSaldo152UpdateManager } from '@/app/jur_3/152/saldo/components/saldo-update-manager'
import { OrganSaldo159UpdateManager } from '@/app/jur_3/159/saldo/components/saldo-update-manager'
import { PodotchetSaldoUpdateManager } from '@/app/jur_4/saldo/components/saldo-update-manager'
import { MaterialWarehouseSaldoUpdateManager } from '@/app/jur_7/saldo/components/saldo-update-manager'
import { LoadingOverlay } from '@/common/components'
import { AuthGuard } from '@/common/features/auth'
import { SpravochnikProvider } from '@/common/features/spravochnik'

import { Header } from './compoonents/header'
import { Sidebar } from './compoonents/sidebar/sidebar'

const MainLayout = () => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 overflow-auto scrollbar">
        <AuthGuard>
          <main className="h-full flex flex-col bg-white">
            <Header />
            <Suspense fallback={<LoadingOverlay />}>
              <ErrorBoundary
                onError={(err) => console.log(err)}
                fallback={'error'}
              >
                <Outlet />
              </ErrorBoundary>
            </Suspense>
          </main>
        </AuthGuard>
      </div>
      <SpravochnikProvider />
      <KassaSaldoUpdateManager />
      <BankSaldoUpdateManager />
      <OrganSaldo159UpdateManager />
      <OrganSaldo152UpdateManager />
      <PodotchetSaldoUpdateManager />
      <MaterialWarehouseSaldoUpdateManager />
    </div>
  )
}

export default MainLayout
