import { Navigate, createHashRouter } from 'react-router-dom'

import AccessPage from './region-admin/access/page'
import AccountablePage from './region-spravochnik/podotchet'
import AdminMainBookDetailsPage from './super-admin/main-book/details/page'
import AdminMoonBookPage from './super-admin/main-book/page'
import AdvanceReportDetailsPage from './podotchet/avans/details/page'
import AktDetailsPage from './organization/akt/details/page'
import AktPage from './organization/akt/page'
import AvansPage from './podotchet/avans/page'
import BankMonitorPage from './bank/monitor/page'
import BankPrixodDetailsPage from './bank/prixod/details/page'
import BankPrixodPage from './bank/prixod/page'
import BankRasxodDetailsPage from './bank/rasxod/details/page'
import BankRasxodPage from './bank/rasxod/page'
import BankSpravochnikPage from './super-admin/bank/page'
import BudgetPage from './super-admin/budjet/page'
import CompleteMonthlyReportDetailsPage from './main-book/complete-monthly-report/details/page'
import CompleteMonthlyReportPage from './main-book/complete-monthly-report/page'
import ContractDetailsPage from './organization/shartnoma/details/page'
import CreateMonthlyReportDetailsPage from './main-book/create-monthly-report/details/page'
import CreateMonthlyReportPage from './main-book/create-monthly-report/page'
import GroupPage from './super-admin/group/page'
import HomePage from './home/page'
import { InternalTransferDetailsPage } from './jur7/internal-transfer/details/page'
import { InternalTransferPage } from './jur7/internal-transfer/page'
import KassaMonitorPage from './kassa/monitor/page'
import KassaPrixodDetailsPage from './kassa/prixod/details/page'
import KassaPrixodPage from './kassa/prixod/page'
import KassaRasxodDetailtsPage from './kassa/rasxod/details/page'
import KassaRasxodPage from './kassa/rasxod/page'
import LogsPage from './super-admin/logs/page'
import { MO7PrixodDetailsPage } from './jur7/prixod/details/page'
import { MO7PrixodPage } from './jur7/prixod/page'
import { MO7RasxodDetailsPage } from './jur7/rasxod/details/page'
import { MO7RasxodPage } from './jur7/rasxod/page'
import MainLayout from './layout/main'
import { MainSchetGuard } from '@/common/features/main-schet'
import MainSchetPage from './region-spravochnik/main-schet/page'
import OperationTypePage from './region-spravochnik/type-operatsii/page'
import OperatsiiPage from './super-admin/operatsii/page'
import OrganizationMonitorPage from './organization/monitor/page'
import OrganizationPage from './region-spravochnik/organization/page'
import { PereotsenkaPage } from './super-admin/pereotsenka/page'
import PodotchetMonitoringPage from './podotchet/monitor/page'
import PodpisPage from './region-spravochnik/podpis/page'
import PokazatUslugiDetailsPage from './organization/pokazat-uslugi/details/page'
import PokazatUslugiPage from './organization/pokazat-uslugi/page'
import RegionDataPage from './super-admin/region-data/page'
import RegionPage from './super-admin/region/page'
import RegionUserPage from './region-admin/region-user'
import ResponsiblePage from './jur7/responsible/page'
import RolePage from './super-admin/role/page'
import type { RouteObject } from 'react-router-dom'
import ShartnomaGrafikDetailsPage from './organization/shartnoma-grafik/details/page'
import ShartnomaGrafikPage from './organization/shartnoma-grafik/page'
import ShartnomaPage from './organization/shartnoma/page'
import SigninPage from './sign-in'
import SmetaGrafikPage from './region-admin/smeta-grafik/page'
import SmetaPage from './super-admin/smeta/page'
import SostavPage from './region-spravochnik/sostav/page'
import Subdivision7Page from './jur7/podrazdelenie/page'
import SubdivisionPage from './region-spravochnik/podrazdelenie/page'
import UnitPage from './super-admin/unit/page'
import UserPage from './super-admin/user/page'

// import DemoPage from './demo/page'

// import NaimenovaniePage from './jur7/naimenovaniya/page'

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
        element: <MainSchetGuard />,
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
            element: <ContractDetailsPage />
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
        element: <MainSchetGuard />,
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
        element: <MainSchetGuard />,
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
            element: <OperationTypePage />
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
            path: 'main-book',
            element: <AdminMoonBookPage />
          },
          {
            path: 'main-book/:id',
            element: <AdminMainBookDetailsPage />
          }
        ]
      },
      {
        path: 'accountable',
        element: <MainSchetGuard />,
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
        element: <MainSchetGuard />,
        children: [
          // {
          //   path: 'denomination',
          //   element: <NaimenovaniePage />
          // },
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
          }
        ]
      },
      {
        path: 'main-book',
        children: [
          {
            path: 'create-monthly-report',
            element: <CreateMonthlyReportPage />
          },
          {
            path: 'create-monthly-report/:id',
            element: <CreateMonthlyReportDetailsPage />
          },
          {
            path: 'close-monthly-report',
            element: <CompleteMonthlyReportPage />
          },
          {
            path: 'close-monthly-report/:id',
            element: <CompleteMonthlyReportDetailsPage />
          }
        ]
      },
      {
        path: 'region-data',
        element: <RegionDataPage />
      },
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '*',
        element: <Navigate to="/" />
      }
    ]
  }
]

export const router = createHashRouter(routes)
