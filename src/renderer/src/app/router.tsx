import type { RouteObject } from 'react-router-dom'

import { lazy } from 'react'

import { Navigate, createHashRouter } from 'react-router-dom'

import { useAuthenticationStore } from '@/common/features/auth'
import { BudjetSelectedGuard, MainSchetSelectedGuard } from '@/common/features/requisites'
import { DuplicateSchetsGuard } from '@/common/features/requisites/guards/duplicate-schets-guard'

import SigninPage from './sign-in'

const AdminKassaPage = lazy(() => import('./super-admin/jur_1/page'))
const AdminBankPage = lazy(() => import('./super-admin/jur_2/page'))
const AdminOrgan152Page = lazy(() => import('./super-admin/jur_3/152/page'))
const AdminOrgan159Page = lazy(() => import('./super-admin/jur_3/159/page'))
const AdminPodotchetPage = lazy(() => import('./super-admin/jur_4/page'))
const AdminMaterialPage = lazy(() => import('./super-admin/jur_7/page'))
const MaterialMonitorPage = lazy(() => import('./jur_7/monitor/page'))
const PrixodSchetPage = lazy(() => import('./jur_8/schet/page'))
const MaterialCreatePage = lazy(() => import('./jur_7/saldo/create/page'))
const DashboardPage = lazy(() => import('./dashboard/page'))
const AdminDashboardPage = lazy(() => import('./super-admin/dashboard/page'))
const DistancePage = lazy(() => import('./super-admin/spravochnik/distance/page'))

const CalculateParamsPage = lazy(() => import('./jur_5/calculate-params/page'))
const PassportInfoPage = lazy(() => import('./jur_5/passport-details/page'))
const StaffingTable = lazy(() => import('./jur_5/staffing-schedule/page'))
const PaymentsPage = lazy(() => import('./jur_5/payment-types/payments/page'))
const DeductionsPage = lazy(() => import('./jur_5/payment-types/deductions/page'))
const WorkTripDetailsPage = lazy(() => import('./jur_4/work-trip/details/page'))
const WorkTripPage = lazy(() => import('./jur_4/work-trip/page'))
const PositionPage = lazy(() => import('./super-admin/spravochnik/position/page'))

const KassaSaldoPage = lazy(() => import('./jur_1/saldo/page'))
const BankSaldoPage = lazy(() => import('./jur_2/saldo/page'))
const PodotchetSaldoPage = lazy(() => import('./jur_4/saldo/page'))
const PodotchetSaldoDetailsPage = lazy(() => import('./jur_4/saldo/details/page'))

const AdminPrixodSchetPage = lazy(() => import('./super-admin/prixod-schet/page'))

const JUR8MonitorPage = lazy(() => import('./jur_8/monitor/page'))
const JUR8MonitorDetailsPage = lazy(() => import('./jur_8/monitor/details/page'))

const AdminVideoTutorialsPage = lazy(() => import('./super-admin/video-tutorials/page'))
const VideoTutorialsPage = lazy(() => import('./video-tutorials/page'))

const AdminOstatokPage = lazy(() => import('./super-admin/saldo/page'))
const ZarplataSpravochnikPage = lazy(() => import('./super-admin/zarplata/spravochnik/page'))

const OrganSaldo159Page = lazy(() => import('./jur_3/159/saldo/page'))
const OrganSaldo159DetailsPage = lazy(() => import('./jur_3/159/saldo/details/page'))

const OrganSaldo152Page = lazy(() => import('./jur_3/152/saldo/page'))
const OrganSaldo152DetailsPage = lazy(() => import('./jur_3/152/saldo/details/page'))

const MainLayout = lazy(() => import('../common/layout/main'))
const BankMonitorPage = lazy(() => import('./jur_2/monitor/page'))
const BankPrixodDetailsPage = lazy(() => import('./jur_2/prixod/details/page'))
const BankPrixodPage = lazy(() => import('./jur_2/prixod/page'))
const BankRasxodDetailsPage = lazy(() => import('./jur_2/rasxod/details/page'))
const BankRasxodPage = lazy(() => import('./jur_2/rasxod/page'))
const Jurnal7InternalTransferDetailsPage = lazy(() => import('./jur_7/internal/details/page'))
const Jurnal7InternalTransferPage = lazy(() => import('./jur_7/internal/page'))
const IznosPage = lazy(() => import('./jur_7/iznos/page'))
const OstatokPage = lazy(() => import('./jur_7/saldo/page'))
const Subdivision7Page = lazy(() => import('./jur_7/podrazdelenie/page'))
const Jurnal7PrixodDetailsPage = lazy(() => import('./jur_7/prixod/details/page'))
const Jurnal7PrixodPage = lazy(() => import('./jur_7/prixod/page'))
const Jurnal7RasxodDetailsPage = lazy(() => import('./jur_7/rasxod/details/page'))
const Jurnal7RasxodPage = lazy(() => import('./jur_7/rasxod/page'))
const ResponsiblePage = lazy(() => import('./jur_7/responsible/page'))
const KassaMonitorPage = lazy(() => import('./jur_1/monitor/page'))
const KassaPrixodDetailsPage = lazy(() => import('./jur_1/prixod/details/page'))
const KassaPrixodPage = lazy(() => import('./jur_1/prixod/page'))
const KassaRasxodDetailtsPage = lazy(() => import('./jur_1/rasxod/details/page'))
const KassaRasxodPage = lazy(() => import('./jur_1/rasxod/page'))

const MainbookPage = lazy(() => import('./reports/mainbook/page'))
const MainbookDetailsPage = lazy(() => import('./reports/mainbook/details/page'))
const OdinoxPage = lazy(() => import('./reports/odinox/page'))
const OdinoxDetailsPage = lazy(() => import('./reports/odinox/details/page'))
const AdminOdinoxPage = lazy(() => import('./super-admin/reports/odinox/page'))
const AdminOdinoxDetailsPage = lazy(() => import('./super-admin/reports/odinox/details/page'))
const RealCostPage = lazy(() => import('./reports/real-cost/page'))
const RealCostDetailsPage = lazy(() => import('./reports/real-cost/details/page'))
const AdminRealCostPage = lazy(() => import('./super-admin/reports/realcost/page'))
const AdminRealCostDetailsPage = lazy(() => import('./super-admin/reports/realcost/details/page'))

const AktDetailsPage = lazy(() => import('./jur_3/159/akt/details/page'))
const AktPage = lazy(() => import('./jur_3/159/akt/page'))
const OrganMonitorig159Page = lazy(() => import('./jur_3/159/monitor/page'))
const OrganMonitorig152Page = lazy(() => import('./jur_3/152/monitor/page'))
const PokazatUslugiDetailsPage = lazy(() => import('./jur_3/152/pokazat-uslugi/details/page'))
const PokazatUslugiPage = lazy(() => import('./jur_3/152/pokazat-uslugi/page'))
const ShartnomaDetailsPage = lazy(() => import('./jur_3/shartnoma/details/page'))
const ShartnomaPage = lazy(() => import('./jur_3/shartnoma/page'))
const AdvanceReportDetailsPage = lazy(() => import('./jur_4/avans/details/page'))
const AvansPage = lazy(() => import('./jur_4/avans/page'))
const PodotchetMonitoringPage = lazy(() => import('./jur_4/monitor/page'))
const RoleAccessPage = lazy(() => import('./region-admin/role-access/page'))
const RegionUserPage = lazy(() => import('./region-admin/region-user'))
const SmetaGrafikPage = lazy(() => import('./smeta-grafik/page'))
const SmetaGrafikDetailsPage = lazy(() => import('./smeta-grafik/details/page'))
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

const OperatsiiPage = lazy(() => import('./super-admin/operatsii/page'))
const PereotsenkaPage = lazy(() => import('./super-admin/pereotsenka/page'))
const RegionDataPage = lazy(() => import('./super-admin/region-data/page'))
const RegionPage = lazy(() => import('./super-admin/region/page'))
const RolePage = lazy(() => import('./super-admin/role/page'))
const SmetaPage = lazy(() => import('./super-admin/smeta/page'))
const UnitPage = lazy(() => import('./super-admin/unit/page'))
const UserPage = lazy(() => import('./super-admin/user/page'))
const DemoPage = lazy(() => import('./_demo/page'))
const ReportTitlePage = lazy(() => import('./super-admin/report-title'))
const VacantPage = lazy(() => import('./region-admin/vacant/page'))
const NachisleniePage = lazy(() => import('./jur_5/nachislenie/page'))

const MinimumWagePage = lazy(() => import('./super-admin/spravochnik/minimum-wage/page'))

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
        element: <MainSchetSelectedGuard />,
        children: [
          {
            path: 'shartnoma',
            element: <ShartnomaPage />
          },
          {
            path: 'shartnoma/:id',
            element: <ShartnomaDetailsPage />
          },
          {
            path: '159',
            children: [
              {
                path: 'monitor',
                element: <OrganMonitorig159Page />
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
                path: 'saldo',
                element: <OrganSaldo159Page />
              },
              {
                path: 'saldo/:id',
                element: <OrganSaldo159DetailsPage />
              }
            ]
          },
          {
            path: '152',
            children: [
              {
                path: 'monitor',
                element: <OrganMonitorig152Page />
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
                path: 'saldo',
                element: <OrganSaldo152Page />
              },
              {
                path: 'saldo/:id',
                element: <OrganSaldo152DetailsPage />
              }
            ]
          }
        ]
      },
      {
        path: 'kassa',
        element: <MainSchetSelectedGuard />,
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
            element: <KassaSaldoPage />
          }
        ]
      },
      {
        path: 'bank',
        element: <MainSchetSelectedGuard />,
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
            element: <BankSaldoPage />
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
            element: <BudjetSelectedGuard />,
            children: [
              {
                index: true,
                element: <MainSchetPage />
              }
            ]
          },
          {
            path: 'sostav',
            element: <SostavPage />
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
            path: 'role-access',
            element: <RoleAccessPage />
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
            path: 'journal-7',
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
            path: 'odinox',
            element: <AdminOdinoxPage />
          },
          {
            path: 'odinox/:id',
            element: <AdminOdinoxDetailsPage />
          },
          {
            path: 'realcost',
            element: <AdminRealCostPage />
          },
          {
            path: 'realcost/:id',
            element: <AdminRealCostDetailsPage />
          },
          {
            path: 'prixod-schets',
            element: <AdminPrixodSchetPage />
          },
          {
            path: 'zarplata/spravochnik',
            element: <ZarplataSpravochnikPage />
          },
          {
            path: 'jur_1',
            element: <AdminKassaPage />
          },
          {
            path: 'jur_2',
            element: <AdminBankPage />
          },
          {
            path: 'jur_3/152',
            element: <AdminOrgan152Page />
          },
          {
            path: 'jur_3/159',
            element: <AdminOrgan159Page />
          },
          {
            path: 'jur_4',
            element: <AdminPodotchetPage />
          },
          {
            path: 'jur_7',
            element: <AdminMaterialPage />
          },
          {
            path: 'spravochnik',
            children: [
              {
                path: 'minimum-wage',
                element: <MinimumWagePage />
              },
              {
                path: 'distance',
                element: <DistancePage />
              },
              {
                path: 'position',
                element: <PositionPage />
              }
            ]
          }
        ]
      },
      {
        path: 'accountable',
        element: <MainSchetSelectedGuard />,
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
            path: 'work-trip',
            element: <WorkTripPage />
          },
          {
            path: 'work-trip/:id',
            element: <WorkTripDetailsPage />
          },
          {
            path: 'saldo',
            element: <PodotchetSaldoPage />
          },
          {
            path: 'saldo/:id',
            element: <PodotchetSaldoDetailsPage />
          }
        ]
      },
      {
        path: 'journal-7',
        element: <MainSchetSelectedGuard />,
        children: [
          {
            path: 'monitor',
            element: <MaterialMonitorPage />
          },
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
            path: 'internal',
            element: <Jurnal7InternalTransferPage />
          },
          {
            path: 'internal/:id',
            element: <Jurnal7InternalTransferDetailsPage />
          },
          {
            path: 'ostatok',
            element: <OstatokPage />
          },
          {
            path: 'ostatok/create',
            element: <MaterialCreatePage />
          },
          {
            path: 'iznos',
            element: <IznosPage />
          }
        ]
      },
      {
        path: 'jur_8',
        element: <MainSchetSelectedGuard />,
        children: [
          {
            path: 'monitor',
            element: <JUR8MonitorPage />
          },
          {
            path: 'monitor/:id',
            element: <JUR8MonitorDetailsPage />
          },
          {
            path: 'schets',
            element: <PrixodSchetPage />
          }
        ]
      },
      {
        path: 'smeta-grafik',
        element: <MainSchetSelectedGuard />,
        children: [
          {
            index: true,
            element: <SmetaGrafikPage />
          },
          {
            path: ':id',
            element: <SmetaGrafikDetailsPage />
          }
        ]
      },
      {
        path: 'mainbook',
        element: <MainSchetSelectedGuard />,
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
        path: 'odinox',
        element: <MainSchetSelectedGuard />,
        children: [
          {
            index: true,
            element: <OdinoxPage />
          },
          {
            path: ':id',
            element: <OdinoxDetailsPage />
          }
        ]
      },
      {
        path: 'realcost',
        element: <MainSchetSelectedGuard />,
        children: [
          {
            index: true,
            element: <RealCostPage />
          },
          {
            path: ':id',
            element: <RealCostDetailsPage />
          }
        ]
      },
      {
        path: 'region-data',
        element: <RegionDataPage />
      },
      {
        path: 'admin/dashboard',
        element: <AdminDashboardPage />
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
        path: 'jur-5',
        children: [
          {
            path: 'calculate-params',
            element: <CalculateParamsPage />
          },
          {
            path: 'staffing_table',
            element: <StaffingTable />
          },
          {
            path: 'passport-info',
            element: <PassportInfoPage />
          },
          {
            path: 'payment-type',
            children: [
              {
                path: 'payments',
                element: <PaymentsPage />
              },
              {
                path: 'deductions',
                element: <DeductionsPage />
              }
            ]
          },
          {
            path: 'nachislenie',
            element: <MainSchetSelectedGuard />,
            children: [
              {
                index: true,
                element: <NachisleniePage />
              }
            ]
          }
        ]
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
