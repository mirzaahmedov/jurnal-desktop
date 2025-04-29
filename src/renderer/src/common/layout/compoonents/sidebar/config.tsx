import type { RoleAccess } from '@/common/models'
import type { TFunction } from 'i18next'
import type { ComponentType, ReactNode } from 'react'

import {
  ArrowLeftRight,
  BadgeDollarSign,
  Banknote,
  Book,
  Building,
  Building2,
  CalendarCheck,
  ChartCandlestick,
  CircleDollarSign,
  CircleFadingPlus,
  Database,
  FileCheck,
  FileCheck2,
  FileClock,
  FileDown,
  FileUp,
  FileVideo,
  Folder,
  Group,
  Landmark,
  LayoutDashboard,
  LayoutGrid,
  LetterText,
  MapPinHouse,
  MonitorCog,
  NotebookTabs,
  NotepadText,
  Percent,
  ReceiptText,
  Settings2,
  ShieldBan,
  ShieldCheck,
  Signature,
  SquareActivity,
  SquareUser,
  SquareUserRound,
  Table2,
  UserCog,
  UserSquare,
  Users,
  Wallet,
  WalletCards,
  Warehouse,
  Weight,
  Wrench
} from 'lucide-react'

import { KassaSaldoController } from '@/app/jur_1/saldo/components/saldo-controller'
import { BankSaldoController } from '@/app/jur_2/saldo/components/saldo-controller'
import { WarehouseSaldoController } from '@/app/jur_7/saldo/components/saldo-controller'
import { AdminRoles } from '@/app/super-admin/role'
import { useAuthenticationStore } from '@/common/features/auth'
import { omitEmptyArrayElements } from '@/common/lib/validation'

export type NavElement = {
  displayOnly?: boolean
  title: ReactNode
  className?: string
  path: string
  icon: ComponentType<any> | null
  children?: NavElement[]
}

export const getNavElements = (t: TFunction): NavElement[] => {
  const user = useAuthenticationStore.getState().user
  const permissions = user?.access_object ?? ({} as RoleAccess)

  const is_super_admin = user?.role_name === AdminRoles.super_admin
  const is_admin = user?.role_name === AdminRoles.region_admin

  return omitEmptyArrayElements<NavElement>([
    {
      path: is_super_admin ? '/admin/dashboard' : '/region/dashboard',
      title: t('pages.main'),
      icon: LayoutDashboard
    },
    !is_super_admin
      ? {
          path: '/video-tutorials',
          title: t('pages.video_tutorials'),
          icon: FileVideo
        }
      : null,
    !is_super_admin && (permissions.kassa || is_admin)
      ? {
          path: '/kassa',
          title: `№1 - МО (${t('pages.kassa')})`,
          icon: BadgeDollarSign,
          children: [
            {
              path: 'monitor',
              title: t('pages.monitoring'),
              icon: SquareActivity
            },
            {
              path: 'prixod',
              title: t('pages.prixod-docs'),
              icon: FileDown
            },
            {
              path: 'rasxod',
              title: t('pages.rasxod-docs'),
              icon: FileUp
            },
            {
              path: 'ostatok',
              title: t('pages.saldo'),
              icon: CircleFadingPlus
            },
            {
              displayOnly: true,
              path: '',
              title: <KassaSaldoController />,
              icon: null
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.bank || is_admin)
      ? {
          path: '/bank',
          title: `№2 - МО (${t('pages.bank')})`,
          icon: Landmark,
          children: [
            {
              path: 'monitor',
              title: t('pages.monitoring'),
              icon: SquareActivity
            },
            {
              path: 'prixod',
              title: t('pages.prixod-docs'),
              icon: FileDown
            },
            {
              path: 'rasxod',
              title: t('pages.rasxod-docs'),
              icon: FileUp
            },
            {
              path: 'ostatok',
              title: t('pages.saldo'),
              icon: CircleFadingPlus
            },
            {
              displayOnly: true,
              path: '',
              title: <BankSaldoController />,
              icon: null
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.jur3 || is_admin)
      ? {
          path: '/organization',
          title: `№3 - МО (${t('pages.organization')})`,
          icon: Building2,
          children: [
            {
              path: 'shartnoma',
              title: t('pages.shartnoma'),
              icon: ReceiptText
            },
            {
              path: '159',
              title: t('pages.akt'),
              icon: FileCheck2,
              children: [
                {
                  path: 'monitor',
                  title: t('pages.monitoring'),
                  icon: SquareActivity
                },
                {
                  path: 'akt',
                  title: t('pages.schet_faktura'),
                  icon: FileCheck2
                },
                {
                  path: 'saldo',
                  title: t('pages.saldo'),
                  icon: CircleFadingPlus
                }
              ]
            },
            {
              path: '152',
              title: t('pages.service'),
              icon: Wrench,
              children: [
                {
                  path: 'monitor',
                  title: t('pages.monitoring'),
                  icon: SquareActivity
                },
                {
                  path: 'pokazat-uslugi',
                  title: t('pages.schet_faktura'),
                  icon: Wrench
                },
                {
                  path: 'saldo',
                  title: t('pages.saldo'),
                  icon: CircleFadingPlus
                }
              ]
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.jur4 || is_admin)
      ? {
          path: '/accountable',
          title: `№4 - МО (${t('pages.podotchet')})`,
          icon: UserSquare,
          children: [
            {
              path: 'monitor',
              title: t('pages.monitoring'),
              icon: SquareActivity
            },
            {
              path: 'advance-report',
              title: t('pages.avans'),
              icon: FileCheck
            },
            {
              path: 'saldo',
              title: t('pages.saldo'),
              icon: CircleFadingPlus
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.jur7 || is_admin)
      ? {
          icon: NotepadText,
          path: '/journal-7',
          title: `№7 - МО (${t('pages.material-warehouse')})`,
          children: [
            {
              icon: SquareActivity,
              path: 'monitor',
              title: t('pages.monitoring')
            },
            {
              icon: FileDown,
              path: 'prixod',
              title: t('pages.prixod-docs')
            },
            {
              icon: FileUp,
              path: 'rasxod',
              title: t('pages.rasxod-docs')
            },
            {
              icon: ArrowLeftRight,
              path: 'internal-transfer',
              title: t('pages.internal-docs')
            },
            {
              path: 'responsible',
              title: t('pages.responsible'),
              icon: UserSquare
            },
            {
              path: 'subdivision-7',
              title: t('pages.podrazdelenie'),
              icon: Building
            },
            {
              path: 'ostatok',
              title: t('pages.saldo'),
              icon: Warehouse
            },
            {
              path: 'iznos',
              title: t('pages.iznos'),
              icon: Percent
            },
            {
              displayOnly: true,
              path: '',
              title: <WarehouseSaldoController />,
              icon: null
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.jur8 || is_admin)
      ? {
          icon: NotepadText,
          path: '/jur_8',
          title: `№8 - МО (${t('pages.jur8')})`,
          children: [
            {
              icon: SquareActivity,
              path: 'monitor',
              title: t('pages.monitoring')
            },
            {
              icon: Percent,
              path: 'schets',
              title: t('pages.schets')
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.spravochnik || is_admin)
      ? {
          path: '/spravochnik',
          title: t('pages.spravochnik'),
          icon: NotebookTabs,
          children: [
            {
              path: 'organization',
              title: t('pages.organization'),
              icon: Building
            },
            {
              path: 'subdivision',
              title: t('pages.podrazdelenie'),
              icon: Building2
            },
            {
              path: 'operation-type',
              title: t('pages.type-operatsii'),
              icon: Folder
            },
            {
              path: 'main-schet',
              title: t('pages.main-schet'),
              icon: Wallet
            },
            {
              path: 'podotchet',
              title: t('pages.podotchet-litso'),
              icon: SquareUser
            },
            {
              path: 'sostav',
              title: t('pages.sostav'),
              icon: Users
            },
            {
              path: 'group',
              title: t('pages.group'),
              icon: Group
            },
            {
              path: 'podpis',
              title: t('pages.podpis'),
              icon: Signature
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.region || is_admin)
      ? {
          path: '/region',
          title: t('pages.region'),
          icon: MapPinHouse,
          children: [
            {
              path: 'user',
              title: t('pages.user'),
              icon: Users
            },
            {
              path: 'role-access',
              title: t('pages.access_rights'),
              icon: ShieldCheck
            },
            {
              path: 'vacant',
              title: t('pages.vacant'),
              icon: SquareUserRound
            }
          ]
        }
      : null,
    is_super_admin
      ? {
          path: '/admin',
          title: t('pages.admin'),
          icon: UserCog,
          children: [
            {
              path: 'report-title',
              title: t('pages.report_title'),
              icon: LetterText
            },
            {
              path: 'video-tutorials',
              title: t('pages.video_tutorials'),
              icon: FileVideo
            },
            {
              path: 'ostatok',
              title: t('pages.saldo'),
              icon: Warehouse
            },
            {
              path: 'mainbook',
              title: t('pages.mainbook'),
              icon: Book
            },
            {
              path: 'realcost',
              title: t('pages.realcost'),
              icon: WalletCards
            },
            {
              path: 'prixod-schets',
              title: t('pages.prixod_schets'),
              icon: Percent
            },
            {
              path: 'logs',
              title: t('pages.logs'),
              icon: FileClock
            },
            {
              path: 'pereotsenka',
              title: t('pages.pereotsenka'),
              icon: ChartCandlestick
            },
            {
              path: 'group',
              title: t('pages.group'),
              icon: Group
            },
            {
              path: 'bank',
              title: t('pages.bank'),
              icon: Building
            },
            {
              path: 'region',
              title: t('pages.region'),
              icon: LayoutGrid
            },
            {
              path: 'role',
              title: t('pages.role'),
              icon: MonitorCog
            },
            {
              path: 'user',
              title: t('pages.user'),
              icon: Users
            },
            {
              path: 'smeta',
              title: t('pages.smeta'),
              icon: CircleFadingPlus
            },
            {
              path: 'budget',
              title: t('pages.budjets'),
              icon: CircleDollarSign
            },
            {
              path: 'operation',
              title: t('pages.operatsii'),
              icon: Percent
            },
            {
              path: 'unit',
              title: t('pages.edin'),
              icon: Weight
            },
            {
              path: 'zarplata',
              title: t('pages.zarplata'),
              icon: Banknote,
              children: [
                {
                  path: 'spravochnik',
                  title: t('pages.spravochnik'),
                  icon: Settings2
                }
              ]
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.smeta_grafik || is_admin)
      ? {
          path: '/smeta-grafik',
          title: t('pages.smeta_grafik'),
          icon: CalendarCheck
        }
      : null,
    !is_super_admin && (permissions.main_book || is_admin)
      ? {
          path: '/mainbook',
          title: t('pages.mainbook'),
          icon: Book
        }
      : null,
    !is_super_admin && (permissions.smeta_grafik || is_admin)
      ? {
          path: '/odinox',
          title: t('pages.odinox'),
          icon: Table2
        }
      : null,
    !is_super_admin
      ? {
          path: '/realcost',
          title: t('pages.realcost'),
          icon: WalletCards
        }
      : null,
    {
      path: '/region-data',
      title: t('pages.region-data'),
      icon: Database
    },
    import.meta.env.DEV
      ? {
          path: '/demo',
          title: 'Demo',
          icon: ShieldBan
        }
      : null
  ])
}
