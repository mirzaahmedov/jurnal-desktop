import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, useNavigate } from 'react-router-dom'

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

import { useKeyUp } from '../hooks'
import { Footer } from './compoonents/footer'
import { Header } from './compoonents/header'
import { Sidebar } from './compoonents/sidebar/sidebar'

const MainLayout = () => {
  const navigate = useNavigate()

  useKeyUp({
    key: 'D',
    ctrlKey: true,
    shiftKey: true,
    handler: () => {
      navigate('/demo')
    }
  })

  return (
    <div className="h-full flex">
      <Sidebar />
      <main className="flex-1 h-full flex flex-col bg-white overflow-x-hidden">
        <AuthGuard>
          <Header />
          <Suspense
            fallback={
              <div className="flex-1">
                <LoadingOverlay />
              </div>
            }
          >
            <ErrorBoundary
              onError={(err) => console.log(err)}
              fallback={'error'}
            >
              <Outlet />
            </ErrorBoundary>
          </Suspense>
          <Footer />
        </AuthGuard>
      </main>
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
