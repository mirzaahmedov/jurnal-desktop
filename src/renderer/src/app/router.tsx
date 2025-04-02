import type { RouteObject } from 'react-router-dom'

import { lazy } from 'react'

import { useAuthenticationStore } from '@renderer/common/features/auth'
import { RequisitesSelectedGuard } from '@renderer/common/features/requisites'
import { DuplicateSchetsGuard } from '@renderer/common/features/requisites/duplicate-schets-guard'
import { Navigate, createHashRouter } from 'react-router-dom'

import BankOstatokDetailsPage from './bank/ostatok/details/page'
import BankOstatokPage from './bank/ostatok/page'
import DashboardPage from './dashboard/page'
import HomePage from './home/page'
import KassaOstatokDetailsPage from './kassa/ostatok/details/page'
import KassaOstatokPage from './kassa/ostatok/page'
import PodotchetOstatokDetailsPage from './podotchet/ostatok/details/page'
import PodotchetOstatokPage from './podotchet/ostatok/page'
import SigninPage from './sign-in'

const AdminVideoTutorialsPage = lazy(() => import('./super-admin/video-tutorials/page'))
const VideoTutorialsPage = lazy(() => import('./video-tutorials/page'))

const AdminOstatokPage = lazy(() => import('./super-admin/ostatok/page'))
const ZarplataSpravochnikPage = lazy(() => import('./super-admin/zarplata/spravochnik/page'))
const OrganOstatokPage = lazy(() => import('./organization/ostatok/page'))
const OrganOstatokDetailsPage = lazy(() => import('./organization/ostatok/details/page'))
const MainLayout = lazy(() => import('../common/layout/main'))
const BankMonitorPage = lazy(() => import('./bank/monitor/page'))
const BankPrixodDetailsPage = lazy(() => import('./bank/prixod/details/page'))
const BankPrixodPage = lazy(() => import('./bank/prixod/page'))
const BankRasxodDetailsPage = lazy(() => import('./bank/rasxod/details/page'))
const BankRasxodPage = lazy(() => import('./bank/rasxod/page'))
const Jurnal7InternalTransferDetailsPage = lazy(() => import('./jur-7/internal/details/page'))
const Jurnal7InternalTransferPage = lazy(() => import('./jur-7/internal/page'))
const IznosPage = lazy(() => import('./jur-7/iznos/page'))
const OstatokPage = lazy(() => import('./jur-7/ostatok/page'))
const Subdivision7Page = lazy(() => import('./jur-7/podrazdelenie/page'))
const Jurnal7PrixodDetailsPage = lazy(() => import('./jur-7/prixod/details/page'))
const Jurnal7PrixodPage = lazy(() => import('./jur-7/prixod/page'))
const Jurnal7RasxodDetailsPage = lazy(() => import('./jur-7/rasxod/details/page'))
const Jurnal7RasxodPage = lazy(() => import('./jur-7/rasxod/page'))
const ResponsiblePage = lazy(() => import('./jur-7/responsible/page'))
const KassaMonitorPage = lazy(() => import('./kassa/monitor/page'))
const KassaPrixodDetailsPage = lazy(() => import('./kassa/prixod/details/page'))
const KassaPrixodPage = lazy(() => import('./kassa/prixod/page'))
const KassaRasxodDetailtsPage = lazy(() => import('./kassa/rasxod/details/page'))
const KassaRasxodPage = lazy(() => import('./kassa/rasxod/page'))
const MainbookPage = lazy(() => import('./reports/mainbook/page'))
const MainbookDetailsPage = lazy(() => import('./reports/mainbook/details/page'))
const PrixodbookPage = lazy(() => import('./reports/prixodbook/page'))
const PrixodbookDetailsPage = lazy(() => import('./reports/prixodbook/details/page'))
const AktDetailsPage = lazy(() => import('./organization/akt/details/page'))
const AktPage = lazy(() => import('./organization/akt/page'))
const OrganizationMonitorPage = lazy(() => import('./organization/monitor/page'))
const PokazatUslugiDetailsPage = lazy(() => import('./organization/pokazat-uslugi/details/page'))
const PokazatUslugiPage = lazy(() => import('./organization/pokazat-uslugi/page'))
const ShartnomaDetailsPage = lazy(() => import('./organization/shartnoma/details/page'))
const ShartnomaPage = lazy(() => import('./organization/shartnoma/page'))
const OXDetailsPage = lazy(() => import('./ox-report/ox-report/details/page'))
const OXPage = lazy(() => import('./ox-report/ox-report/page'))
const OXReportDetailsPage = lazy(() => import('./ox-report/report/details/page'))
const OXReportPage = lazy(() => import('./ox-report/report/page'))
const AdvanceReportDetailsPage = lazy(() => import('./podotchet/avans/details/page'))
const AvansPage = lazy(() => import('./podotchet/avans/page'))
const PodotchetMonitoringPage = lazy(() => import('./podotchet/monitor/page'))
const ExpensesDetailsPage = lazy(() => import('./real-expenses/real-expenses/details/page'))
const ExpensesPage = lazy(() => import('./real-expenses/real-expenses/page'))
const ExpensesReportDetailsPage = lazy(() => import('./real-expenses/report/details/page'))
const RealExpensesReportPage = lazy(() => import('./real-expenses/report/page'))
const AccessPage = lazy(() => import('./region-admin/access/page'))
const RegionUserPage = lazy(() => import('./region-admin/region-user'))
const SmetaGrafikPage = lazy(() => import('./region-spravochnik/smeta-grafik/page'))
const MainSchetPage = lazy(() => import('./region-spravochnik/main-schet/page'))
const OrganizationPage = lazy(() => import('./region-spravochnik/organization/page'))
const AccountablePage = lazy(() => import('./region-spravochnik/podotchet'))
const PodpisPage = lazy(() => import('./region-spravochnik/podpis/page'))
const SubdivisionPage = lazy(() => import('./region-spravochnik/podrazdelenie/page'))
const SostavPage = lazy(() => import('./region-spravochnik/sostav/page'))
const TypeOperatsiiPage = lazy(() => import('./region-spravochnik/type-operatsii/page'))
const BankSpravochnikPage = lazy(() => import('./super-admin/bank/page'))
const BudgetPage = lazy(() => import('./super-admin/budjet/page'))
const GroupPage = lazy(() => import('./super-admin/group/page'))
const RegionGroupPage = lazy(() => import('./region-spravochnik/group/page'))
const LogsPage = lazy(() => import('./super-admin/logs/page'))

const AdminMainbookDetailsPage = lazy(() => import('./super-admin/reports/mainbook/details/page'))
const AdminMainbookPage = lazy(() => import('./super-admin/reports/mainbook/page'))

const AdminPrixodbookDetailsPage = lazy(
  () => import('./super-admin/reports/prixodbook/details/page')
)
const AdminPrixodbookPage = lazy(() => import('./super-admin/reports/prixodbook/page'))

const OperatsiiPage = lazy(() => import('./super-admin/operatsii/page'))
const AdminOXDetailsPage = lazy(() => import('./super-admin/ox-report/details/page'))
const AdminOXPage = lazy(() => import('./super-admin/ox-report/page'))
const PereotsenkaPage = lazy(() => import('./super-admin/pereotsenka/page'))
const AdminRealExpenseDetailsPage = lazy(() => import('./super-admin/real-expenses/details/page'))
const AdminRealExpensesPage = lazy(() => import('./super-admin/real-expenses/page'))
const RegionDataPage = lazy(() => import('./super-admin/region-data/page'))
const RegionPage = lazy(() => import('./super-admin/region/page'))
const RolePage = lazy(() => import('./super-admin/role/page'))
const SmetaPage = lazy(() => import('./super-admin/smeta/page'))
const UnitPage = lazy(() => import('./super-admin/unit/page'))
const UserPage = lazy(() => import('./super-admin/user/page'))
const DemoPage = lazy(() => import('./_demo/page'))
const ReportTitlePage = lazy(() => import('./super-admin/report-title'))
const VacantPage = lazy(() => import('./region-admin/vacant/page'))

const FallbackRoute = () => {
  const user = useAuthenticationStore((store) => store.user)
  return user?.role_name === 'super-admin' ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/region/dashboard" />
  )
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <SigninPage />
  },
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: 'organization',
        element: <RequisitesSelectedGuard />,
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
          },
          {
            path: 'ostatok',
            element: <OrganOstatokPage />
          },
          {
            path: 'ostatok/:id',
            element: <OrganOstatokDetailsPage />
          }
        ]
      },
      {
        path: 'kassa',
        element: <RequisitesSelectedGuard />,
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
          },
          {
            path: 'ostatok',
            element: <KassaOstatokPage />
          },
          {
            path: 'ostatok/:id',
            element: <KassaOstatokDetailsPage />
          }
        ]
      },
      {
        path: 'bank',
        element: <RequisitesSelectedGuard />,
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
          },
          {
            path: 'ostatok',
            element: <BankOstatokPage />
          },
          {
            path: 'ostatok/:id',
            element: <BankOstatokDetailsPage />
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
            path: 'group',
            element: <RegionGroupPage />
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
          },
          {
            path: 'vacant',
            element: <VacantPage />
          }
        ]
      },
      {
        path: 'admin',
        children: [
          {
            path: 'report-title',
            element: <ReportTitlePage />
          },
          {
            path: 'video-tutorials',
            element: <AdminVideoTutorialsPage />
          },
          {
            path: 'ostatok',
            element: <AdminOstatokPage />
          },
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
            path: 'prixodbook',
            element: <AdminPrixodbookPage />
          },
          {
            path: 'prixodbook/:id',
            element: <AdminPrixodbookDetailsPage />
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
          },
          {
            path: 'zarplata/spravochnik',
            element: <ZarplataSpravochnikPage />
          }
        ]
      },
      {
        path: 'accountable',
        element: <RequisitesSelectedGuard />,
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
          },
          {
            path: 'ostatok',
            element: <PodotchetOstatokPage />
          },
          {
            path: 'ostatok/:id',
            element: <PodotchetOstatokDetailsPage />
          }
        ]
      },
      {
        path: 'journal-7',
        element: <RequisitesSelectedGuard />,
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
            element: <Jurnal7PrixodPage />
          },
          {
            path: 'prixod/:id',
            element: <Jurnal7PrixodDetailsPage />
          },
          {
            path: 'rasxod',
            element: <Jurnal7RasxodPage />
          },
          {
            path: 'rasxod/:id',
            element: <Jurnal7RasxodDetailsPage />
          },
          {
            path: 'internal-transfer',
            element: <Jurnal7InternalTransferPage />
          },
          {
            path: 'internal-transfer/:id',
            element: <Jurnal7InternalTransferDetailsPage />
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
        element: <RequisitesSelectedGuard />,
        children: [
          {
            path: '*',
            element: <DuplicateSchetsGuard />,
            children: [
              {
                index: true,
                element: <MainbookPage />
              },
              {
                path: ':id',
                element: <MainbookDetailsPage />
              }
            ]
          }
        ]
      },
      {
        path: 'prixodbook',
        element: <RequisitesSelectedGuard />,
        children: [
          {
            path: '*',
            element: <DuplicateSchetsGuard />,
            children: [
              {
                index: true,
                element: <PrixodbookPage />
              },
              {
                path: ':id',
                element: <PrixodbookDetailsPage />
              }
            ]
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
        path: 'video-tutorials',
        element: <VideoTutorialsPage />
      },
      {
        path: 'demo',
        element: import.meta.env.DEV ? <DemoPage /> : null
      },
      {
        path: '*',
        element: <FallbackRoute />
      }
    ]
  }
]

export const router = createHashRouter(routes)
