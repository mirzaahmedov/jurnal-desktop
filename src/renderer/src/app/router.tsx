import type { RouteObject } from 'react-router-dom'

import { useAuthenticationStore } from '@renderer/common/features/auth'
import { RequisitesGuard } from '@renderer/common/features/requisites'
import { Navigate, createHashRouter } from 'react-router-dom'

// Todo: fix inconsistent imports
import MainLayout from '../common/layout/main'
import BankMonitorPage from './bank/monitor/page'
import BankPrixodDetailsPage from './bank/prixod/details/page'
import BankPrixodPage from './bank/prixod/page'
import BankRasxodDetailsPage from './bank/rasxod/details/page'
import BankRasxodPage from './bank/rasxod/page'
import DashboardPage from './dashboard/page'
import HomePage from './home/page'
import { InternalTransferDetailsPage } from './jurnal-7/internal-transfer/details/page'
import { InternalTransferPage } from './jurnal-7/internal-transfer/page'
import IznosPage from './jurnal-7/iznos/page'
import OstatokPage from './jurnal-7/ostatok/page'
import Subdivision7Page from './jurnal-7/podrazdelenie/page'
import { MO7PrixodDetailsPage } from './jurnal-7/prixod/details/page'
import { MO7PrixodPage } from './jurnal-7/prixod/page'
import { MO7RasxodDetailsPage } from './jurnal-7/rasxod/details/page'
import { MO7RasxodPage } from './jurnal-7/rasxod/page'
import ResponsiblePage from './jurnal-7/responsible/page'
import KassaMonitorPage from './kassa/monitor/page'
import KassaPrixodDetailsPage from './kassa/prixod/details/page'
import KassaPrixodPage from './kassa/prixod/page'
import KassaRasxodDetailtsPage from './kassa/rasxod/details/page'
import KassaRasxodPage from './kassa/rasxod/page'
import MainbookDetailsPage from './mainbook/mainbook/details/page'
import MainbookPage from './mainbook/mainbook/page'
import MainbookReportDetailsPage from './mainbook/report/details/page'
import MainbookReportPage from './mainbook/report/page'
import AktDetailsPage from './organization/akt/details/page'
import AktPage from './organization/akt/page'
import OrganizationMonitorPage from './organization/monitor/page'
import PokazatUslugiDetailsPage from './organization/pokazat-uslugi/details/page'
import PokazatUslugiPage from './organization/pokazat-uslugi/page'
import ShartnomaGrafikDetailsPage from './organization/shartnoma-grafik/details/page'
import ShartnomaGrafikPage from './organization/shartnoma-grafik/page'
import ShartnomaDetailsPage from './organization/shartnoma/details/page'
import ShartnomaPage from './organization/shartnoma/page'
import OXDetailsPage from './ox-report/ox-report/details/page'
import OXPage from './ox-report/ox-report/page'
import OXReportDetailsPage from './ox-report/report/details/page'
import OXReportPage from './ox-report/report/page'
import AdvanceReportDetailsPage from './podotchet/avans/details/page'
import AvansPage from './podotchet/avans/page'
import PodotchetMonitoringPage from './podotchet/monitor/page'
import ExpensesDetailsPage from './real-expenses/real-expenses/details/page'
import ExpensesPage from './real-expenses/real-expenses/page'
import ExpensesReportDetailsPage from './real-expenses/report/details/page'
import RealExpensesReportPage from './real-expenses/report/page'
import AccessPage from './region-admin/access/page'
import RegionUserPage from './region-admin/region-user'
import SmetaGrafikPage from './region-admin/smeta-grafik/page'
import MainSchetPage from './region-spravochnik/main-schet/page'
import OrganizationPage from './region-spravochnik/organization/page'
import AccountablePage from './region-spravochnik/podotchet'
import PodpisPage from './region-spravochnik/podpis/page'
import SubdivisionPage from './region-spravochnik/podrazdelenie/page'
import SostavPage from './region-spravochnik/sostav/page'
import TypeOperatsiiPage from './region-spravochnik/type-operatsii/page'
import SigninPage from './sign-in'
import BankSpravochnikPage from './super-admin/bank/page'
import BudgetPage from './super-admin/budjet/page'
import GroupPage from './super-admin/group/page'
import LogsPage from './super-admin/logs/page'
import AdminMainbookDetailsPage from './super-admin/mainbook/details/page'
import AdminMainbookPage from './super-admin/mainbook/page'
import OperatsiiPage from './super-admin/operatsii/page'
import AdminOXDetailsPage from './super-admin/ox-report/details/page'
import AdminOXPage from './super-admin/ox-report/page'
import PereotsenkaPage from './super-admin/pereotsenka/page'
import AdminRealExpenseDetailsPage from './super-admin/real-expenses/details/page'
import AdminRealExpensesPage from './super-admin/real-expenses/page'
import RegionDataPage from './super-admin/region-data/page'
import RegionPage from './super-admin/region/page'
import RolePage from './super-admin/role/page'
import SmetaPage from './super-admin/smeta/page'
import UnitPage from './super-admin/unit/page'
import UserPage from './super-admin/user/page'

const FallbackRoute = () => {
  const { user } = useAuthenticationStore()
  return user?.role_name === 'super-admin' ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/region/dashboard" />
  )
}

export const routes: RouteObject[] = [
  {
    path: '/signin',
    element: <SigninPage />
  },
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: 'organization',
        element: <RequisitesGuard />,
        children: [
          {
            path: 'monitor',
            element: <OrganizationMonitorPage />
          },
          {
            path: 'shartnoma',
            element: <ShartnomaPage />
          },
          {
            path: 'shartnoma/:id',
            element: <ShartnomaDetailsPage />
          },
          {
            path: 'shartnoma-grafik',
            element: <ShartnomaGrafikPage />
          },
          {
            path: 'shartnoma-grafik/:id',
            element: <ShartnomaGrafikDetailsPage />
          },
          {
            path: 'akt',
            element: <AktPage />
          },
          {
            path: 'akt/:id',
            element: <AktDetailsPage />
          },
          {
            path: 'pokazat-uslugi',
            element: <PokazatUslugiPage />
          },
          {
            path: 'pokazat-uslugi/:id',
            element: <PokazatUslugiDetailsPage />
          }
        ]
      },
      {
        path: 'kassa',
        element: <RequisitesGuard />,
        children: [
          {
            path: 'prixod',
            element: <KassaPrixodPage />
          },
          {
            path: 'prixod/:id',
            element: <KassaPrixodDetailsPage />
          },
          {
            path: 'rasxod',
            element: <KassaRasxodPage />
          },
          {
            path: 'rasxod/:id',
            element: <KassaRasxodDetailtsPage />
          },
          {
            path: 'monitor',
            element: <KassaMonitorPage />
          }
        ]
      },
      {
        path: 'bank',
        element: <RequisitesGuard />,
        children: [
          {
            path: 'prixod',
            element: <BankPrixodPage />
          },
          {
            path: 'prixod/:id',
            element: <BankPrixodDetailsPage />
          },
          {
            path: 'rasxod',
            element: <BankRasxodPage />
          },
          {
            path: 'rasxod/:id',
            element: <BankRasxodDetailsPage />
          },
          {
            path: 'monitor',
            element: <BankMonitorPage />
          }
        ]
      },
      {
        path: 'spravochnik',
        children: [
          {
            path: 'organization',
            element: <OrganizationPage />
          },
          {
            path: 'subdivision',
            element: <SubdivisionPage />
          },
          {
            path: 'operation-type',
            element: <TypeOperatsiiPage />
          },
          {
            path: 'podotchet',
            element: <AccountablePage />
          },
          {
            path: 'main-schet',
            element: <MainSchetPage />
          },
          {
            path: 'sostav',
            element: <SostavPage />
          },
          {
            path: 'smeta-grafik',
            element: <SmetaGrafikPage />
          },
          {
            path: 'podpis',
            element: <PodpisPage />
          }
        ]
      },
      {
        path: 'region',
        children: [
          {
            path: 'access',
            element: <AccessPage />
          },
          {
            path: 'user',
            element: <RegionUserPage />
          }
        ]
      },
      {
        path: 'admin',
        children: [
          {
            path: 'logs',
            element: <LogsPage />
          },
          {
            path: 'bank',
            element: <BankSpravochnikPage />
          },
          {
            path: 'region',
            element: <RegionPage />
          },
          {
            path: 'role',
            element: <RolePage />
          },
          {
            path: 'user',
            element: <UserPage />
          },
          {
            path: 'smeta',
            element: <SmetaPage />
          },
          {
            path: 'budget',
            element: <BudgetPage />
          },
          {
            path: 'operation',
            element: <OperatsiiPage />
          },
          {
            path: 'pereotsenka',
            element: <PereotsenkaPage />
          },
          {
            path: 'group',
            element: <GroupPage />
          },
          {
            path: 'unit',
            element: <UnitPage />
          },
          {
            path: 'mainbook',
            element: <AdminMainbookPage />
          },
          {
            path: 'mainbook/:id',
            element: <AdminMainbookDetailsPage />
          },
          {
            path: 'expenses',
            element: <AdminRealExpensesPage />
          },
          {
            path: 'expenses/:id',
            element: <AdminRealExpenseDetailsPage />
          },
          {
            path: 'ox-report',
            element: <AdminOXPage />
          },
          {
            path: 'ox-report/:id',
            element: <AdminOXDetailsPage />
          }
        ]
      },
      {
        path: 'accountable',
        element: <RequisitesGuard />,
        children: [
          {
            path: 'monitor',
            element: <PodotchetMonitoringPage />
          },
          {
            path: 'advance-report',
            element: <AvansPage />
          },
          {
            path: 'advance-report/:id',
            element: <AdvanceReportDetailsPage />
          }
        ]
      },
      {
        path: 'journal-7',
        element: <RequisitesGuard />,
        children: [
          {
            path: 'responsible',
            element: <ResponsiblePage />
          },
          {
            path: 'subdivision-7',
            element: <Subdivision7Page />
          },
          {
            path: 'prixod',
            element: <MO7PrixodPage />
          },
          {
            path: 'prixod/:id',
            element: <MO7PrixodDetailsPage />
          },
          {
            path: 'rasxod',
            element: <MO7RasxodPage />
          },
          {
            path: 'rasxod/:id',
            element: <MO7RasxodDetailsPage />
          },
          {
            path: 'internal-transfer',
            element: <InternalTransferPage />
          },
          {
            path: 'internal-transfer/:id',
            element: <InternalTransferDetailsPage />
          },
          {
            path: 'ostatok',
            element: <OstatokPage />
          },
          {
            path: 'iznos',
            element: <IznosPage />
          }
        ]
      },
      {
        path: 'mainbook',
        children: [
          {
            path: 'report',
            element: <MainbookReportPage />
          },
          {
            path: 'report/:id',
            element: <MainbookReportDetailsPage />
          },
          {
            index: true,
            element: <MainbookPage />
          },
          {
            path: ':id',
            element: <MainbookDetailsPage />
          }
        ]
      },
      {
        path: 'expenses',
        children: [
          {
            path: 'report',
            element: <RealExpensesReportPage />
          },
          {
            path: 'report/:id',
            element: <ExpensesReportDetailsPage />
          },
          {
            index: true,
            element: <ExpensesPage />
          },
          {
            path: ':id',
            element: <ExpensesDetailsPage />
          }
        ]
      },
      {
        path: 'ox-report',
        children: [
          {
            path: 'report',
            element: <OXReportPage />
          },
          {
            path: 'report/:id',
            element: <OXReportDetailsPage />
          },
          {
            index: true,
            element: <OXPage />
          },
          {
            path: ':id',
            element: <OXDetailsPage />
          }
        ]
      },
      {
        path: 'region-data',
        element: <RegionDataPage />
      },
      {
        path: 'admin/dashboard',
        element: <HomePage />
      },
      {
        path: 'region/dashboard',
        element: <DashboardPage />
      },
      {
        path: 'demo',
        element: null
      },
      {
        path: '*',
        element: <FallbackRoute />
      }
    ]
  }
]

export const router = createHashRouter(routes)
