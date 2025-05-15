import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

import { KassaSaldoUpdateManager } from '@/app/jur_1/saldo/components/saldo-update-manager'
import { BankSaldoUpdateManager } from '@/app/jur_2/saldo/components/saldo-update-manager'
import { OrganUslugiSaldopdateManager } from '@/app/jur_3/152/saldo/components/saldo-update-manager'
import { OrganAktSaldoUpdateManager } from '@/app/jur_3/159/saldo/components/saldo-update-manager'
import { PodotchetSaldoUpdateManager } from '@/app/jur_4/saldo/components/saldo-update-manager'
import { MaterialWarehouseSaldoUpdateManager } from '@/app/jur_7/saldo/components/saldo-update-manager'
import { MainbookSaldoUpdateManager } from '@/app/reports/mainbook/saldo/saldo-update-manager'
import { LoadingOverlay } from '@/common/components'
import { AuthGuard } from '@/common/features/auth'
import { ConstantsProvider } from '@/common/features/constants/provider'
import { SpravochnikProvider } from '@/common/features/spravochnik'

import { Footer } from './compoonents/footer'
import { Header } from './compoonents/header'
import { Sidebar } from './compoonents/sidebar/sidebar'

const MainLayout = () => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
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
            <Footer />
          </main>
        </AuthGuard>
      </div>
      <SpravochnikProvider />
      <KassaSaldoUpdateManager />
      <BankSaldoUpdateManager />
      <OrganAktSaldoUpdateManager />
      <OrganUslugiSaldopdateManager />
      <PodotchetSaldoUpdateManager />
      <MaterialWarehouseSaldoUpdateManager />
      <MainbookSaldoUpdateManager />
      <ConstantsProvider />
    </div>
  )
}

export default MainLayout
