import { Outlet } from 'react-router-dom'

import { KassaSaldoUpdateManager } from '@/app/jur_1/saldo/components/saldo-update-manager'
import { BankSaldoUpdateManager } from '@/app/jur_2/saldo/components/saldo-update-manager'
import { OrganSaldoUpdateManager } from '@/app/jur_3/saldo/components/saldo-update-manager'
import { PodotchetSaldoUpdateManager } from '@/app/jur_4/saldo/components/saldo-update-manager'
import { Jur7SaldoUpdateManager } from '@/app/jur_7/saldo/components/saldo-update-manager'
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
            <Outlet />
          </main>
        </AuthGuard>
      </div>
      <SpravochnikProvider />
      <KassaSaldoUpdateManager />
      <BankSaldoUpdateManager />
      <OrganSaldoUpdateManager />
      <PodotchetSaldoUpdateManager />
      <Jur7SaldoUpdateManager />
    </div>
  )
}

export default MainLayout
