import type { Access } from '@/common/models'
import type { TFunction } from 'i18next'
import type { ComponentType, ReactNode } from 'react'

import { OstatokController } from '@renderer/app/jurnal-7/ostatok/ostatok-controller'
import { adminRoles } from '@renderer/app/super-admin/role'
import {
  ArrowLeftRight,
  BadgeDollarSign,
  Banknote,
  Building,
  Building2,
  CalendarCheck,
  CalendarPlus2,
  CalendarX,
  ChartCandlestick,
  CircleDollarSign,
  CircleFadingPlus,
  CircleHelp,
  Database,
  FileCheck,
  FileCheck2,
  FileClock,
  FileDown,
  FileUp,
  Folder,
  Group,
  Landmark,
  LayoutDashboard,
  LayoutGrid,
  LetterText,
  MapPinHouse,
  MonitorCog,
  NotebookTabs,
  NotebookText,
  NotepadText,
  Percent,
  ReceiptText,
  Settings2,
  Sheet,
  ShieldCheck,
  Signature,
  SquareActivity,
  SquareUser,
  Truck,
  UserCog,
  UserSquare,
  Users,
  Wallet,
  Warehouse,
  Weight
} from 'lucide-react'

import { useAuthenticationStore } from '@/common/features/auth'
import { omitEmptyArrayElements } from '@/common/lib/validation'

export type NavElement = {
  noLink?: boolean
  title: ReactNode
  className?: string
  path: string
  icon: ComponentType<any> | null
  children?: NavElement[]
}

export const getNavElements = (t: TFunction): NavElement[] => {
  const user = useAuthenticationStore.getState().user
  const access = user?.access_object ?? ({} as Access)

  const is_super_admin = user?.role_name === adminRoles.super_admin
  const is_admin = user?.role_name === adminRoles.region_admin

  const permissions: Partial<Access> = {
    kassa: !is_super_admin && access.kassa,
    bank: !is_super_admin && access.bank,
    shartnoma: !is_super_admin && access.shartnoma,
    spravochnik: !is_super_admin && access.spravochnik,
    organization_monitoring: !is_super_admin && access.organization_monitoring,
    jur3: !is_super_admin && access.jur3,
    jur4: !is_super_admin && access.jur4,
    jur152: !is_super_admin && access.jur152,
    jur7: !is_super_admin && access.jur7,
    smeta_grafik: !is_super_admin && access.smeta_grafik,
    podotchet_monitoring: !is_super_admin && access.podotchet_monitoring,
    access: is_admin && access.access,
    region_users: is_admin && access.region_users,
    budjet: is_super_admin && access.budjet,
    region: is_super_admin && access.region,
    smeta: is_super_admin && access.smeta,
    role: is_super_admin && access.role,
    users: is_super_admin && access.users
  }

  return omitEmptyArrayElements<NavElement>([
    {
      path: is_super_admin ? '/admin/dashboard' : '/region/dashboard',
      title: t('pages.main'),
      icon: LayoutDashboard
    },
    permissions.kassa
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
            }
          ]
        }
      : null,
    permissions.bank
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
            }
          ]
        }
      : null,
    [
      permissions.organization_monitoring,
      permissions.shartnoma,
      permissions.jur3,
      permissions.jur152
    ].includes(true)
      ? {
          path: '/organization',
          title: `№3 - МО (${t('pages.organization')})`,
          icon: Building2,
          children: omitEmptyArrayElements([
            permissions.organization_monitoring
              ? {
                  path: 'monitor',
                  title: t('pages.organization-monitoring'),
                  icon: CircleHelp
                }
              : null,
            permissions.shartnoma
              ? {
                  path: 'shartnoma',
                  title: t('pages.shartnoma'),
                  icon: ReceiptText
                }
              : null,
            permissions.jur3
              ? {
                  path: 'akt',
                  title: t('pages.akt'),
                  icon: FileCheck2
                }
              : null,
            permissions.jur152
              ? {
                  path: 'pokazat-uslugi',
                  title: t('pages.service'),
                  icon: Truck
                }
              : null
          ])
        }
      : null,
    [permissions.podotchet_monitoring, permissions.jur4].includes(true)
      ? {
          path: '/accountable',
          title: `№4 - МО (${t('pages.podotchet')})`,
          icon: UserSquare,
          children: omitEmptyArrayElements([
            permissions.podotchet_monitoring
              ? {
                  path: 'monitor',
                  title: t('pages.podotchet-monitoring'),
                  icon: CircleHelp
                }
              : null,
            permissions.jur4
              ? {
                  path: 'advance-report',
                  title: t('pages.avans'),
                  icon: FileCheck
                }
              : null
          ])
        }
      : null,
    permissions.jur7
      ? {
          icon: NotepadText,
          path: '/journal-7',
          title: `№7 - МО (${t('pages.material-warehouse')})`,
          children: [
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
              title: t('pages.ostatok'),
              icon: Warehouse
            },
            {
              path: 'iznos',
              title: t('pages.iznos'),
              icon: Percent
            },
            {
              noLink: true,
              path: '',
              title: <OstatokController />,
              icon: null
            }
          ]
        }
      : null,
    permissions.spravochnik
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
            // {
            //   path: 'raschet-schet',
            //   title: t('raschet-schet'),
            //   icon: CreditCard
            // },
            // {
            //   path: 'raschet-schet-gazna',
            //   title: t('raschet-schet-gazna'),
            //   icon: CreditCard
            // },
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
              path: 'smeta-grafik',
              title: t('pages.smeta-grafik'),
              icon: CalendarCheck
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
    is_admin && [permissions.region_users, permissions.access].includes(true)
      ? {
          path: '/region',
          title: t('pages.region'),
          icon: MapPinHouse,
          children: omitEmptyArrayElements([
            permissions.region_users
              ? {
                  path: 'user',
                  title: t('pages.user'),
                  icon: Users
                }
              : null,
            permissions.access
              ? {
                  path: 'access',
                  title: t('pages.access'),
                  icon: ShieldCheck
                }
              : null
          ])
        }
      : null,
    is_super_admin
      ? {
          path: '/admin',
          title: t('pages.admin'),
          icon: UserCog,
          children: omitEmptyArrayElements<NavElement>([
            {
              path: 'report-title',
              title: t('pages.report-title'),
              icon: LetterText
            },
            {
              path: 'ostatok',
              title: t('pages.ostatok'),
              icon: Warehouse
            },
            {
              path: 'mainbook',
              title: t('pages.mainbook'),
              icon: NotebookText
            },
            {
              path: 'expenses',
              title: t('pages.real-expenses'),
              icon: Wallet
            },
            {
              path: 'ox-report',
              title: t('pages.1ox-report'),
              icon: Sheet
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
            permissions.region
              ? {
                  path: 'region',
                  title: t('pages.region'),
                  icon: LayoutGrid
                }
              : null,
            permissions.role
              ? {
                  path: 'role',
                  title: t('pages.role'),
                  icon: MonitorCog
                }
              : null,
            permissions.users
              ? {
                  path: 'user',
                  title: t('pages.user'),
                  icon: Users
                }
              : null,
            permissions.smeta
              ? {
                  path: 'smeta',
                  title: t('pages.smeta'),
                  icon: CircleFadingPlus
                }
              : null,
            permissions.budjet
              ? {
                  path: 'budget',
                  title: t('pages.budjets'),
                  icon: CircleDollarSign
                }
              : null,
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
          ])
        }
      : null,
    !is_super_admin
      ? {
          path: '/mainbook',
          title: t('pages.mainbook'),
          icon: NotebookText,
          children: [
            {
              path: 'report',
              title: t('pages.create-month-report'),
              icon: CalendarPlus2
            },
            {
              path: '/',
              title: t('pages.complete-month-report'),
              icon: CalendarX
            }
          ]
        }
      : null,
    !is_super_admin
      ? {
          icon: Wallet,
          title: t('pages.real-expenses'),
          path: '/expenses',
          children: [
            {
              path: 'report',
              title: t('pages.create-month-report'),
              icon: CalendarPlus2
            },
            {
              path: '/',
              title: t('pages.complete-month-report'),
              icon: CalendarX
            }
          ]
        }
      : null,
    !is_super_admin
      ? {
          icon: Sheet,
          title: t('pages.1ox-report'),
          path: '/ox-report',
          children: [
            {
              path: 'report',
              title: t('pages.create-month-report'),
              icon: CalendarPlus2
            },
            {
              path: '/',
              title: t('pages.complete-month-report'),
              icon: CalendarX
            }
          ]
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
          title: 'Demo page',
          icon: Database
        }
      : null
  ])
}
