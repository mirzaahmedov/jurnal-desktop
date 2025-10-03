import type { RoleAccess } from '@/common/models'
import type { TFunction } from 'i18next'
import type { ComponentType, HTMLAttributes, ReactNode } from 'react'

import {
  AppWindow,
  ArrowLeftRight,
  BadgeDollarSign,
  Book,
  BriefcaseBusiness,
  Building,
  Building2,
  Calculator,
  CalendarCheck,
  ChartCandlestick,
  CircleDollarSign,
  CircleFadingPlus,
  Database,
  DollarSign,
  FileCheck,
  FileCheck2,
  FileClock,
  FileDown,
  FileUp,
  FileVideo,
  Folder,
  Group,
  IdCard,
  Landmark,
  LayoutDashboard,
  LayoutGrid,
  LetterText,
  MapPinHouse,
  MapPinned,
  MonitorCog,
  NotebookTabs,
  NotepadText,
  Percent,
  Receipt,
  ReceiptText,
  RemoveFormatting,
  Ruler,
  Settings,
  ShieldBan,
  ShieldCheck,
  Signature,
  SquareActivity,
  SquareCheck,
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
import { ZarplataActions } from '@/common/features/zarplata/zarplata-actions'
import { omitEmptyArrayElements } from '@/common/lib/validation'

export interface INavElement {
  props?: HTMLAttributes<HTMLDivElement>
  displayOnly?: boolean
  title: ReactNode
  className?: string
  path: string
  icon: ComponentType<any> | null
  children?: INavElement[]
}

export const getNavElements = (t: TFunction, budjetId: number): INavElement[] => {
  const user = useAuthenticationStore.getState().user
  const permissions =
    user?.acesses?.find((access) => access.budjet_id === budjetId) ?? ({} as RoleAccess)

  const is_super_admin = user?.role_name === AdminRoles.super_admin
  const is_admin = user?.role_name === AdminRoles.region_admin
  const is_revisor = user?.login === 'revizor'

  return omitEmptyArrayElements<INavElement>([
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
          title: `1-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_1').toLowerCase()}`,
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
          title: `2-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_2').toLowerCase()}`,
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

    !is_super_admin &&
    ([
      permissions.zarplata_1,
      permissions.zarplata_2,
      permissions.zarplata_3,
      permissions.zarplata_4,
      permissions.zarplata_5
    ].some(Boolean) ||
      is_admin)
      ? {
          path: '/jur-5',
          title: `5-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_5').toLowerCase()}`,
          icon: Receipt,
          children: omitEmptyArrayElements<INavElement>([
            permissions.zarplata_1 || is_admin
              ? {
                  path: 'staffing_table',
                  title: t('pages.staffing_table'),
                  icon: SquareCheck
                }
              : null,
            permissions.zarplata_2 || is_admin
              ? {
                  path: 'calculate-params',
                  title: t('pages.calc_parameters'),
                  icon: Settings
                }
              : null,
            permissions.zarplata_3 || is_admin
              ? {
                  path: 'passport-info',
                  title: t('pages.passport_details'),
                  icon: IdCard
                }
              : null,
            permissions.zarplata_4 || is_admin
              ? {
                  path: 'nachislenie',
                  title: t('pages.nachislenie'),
                  icon: Calculator
                }
              : null,
            permissions.zarplata_5 || is_admin
              ? {
                  path: 'payment-type',
                  title: t('pages.payment_type'),
                  icon: Folder,
                  children: [
                    {
                      path: 'payments',
                      title: t('pages.payments'),
                      icon: ReceiptText
                    },
                    {
                      path: 'deductions',
                      title: t('pages.deductions'),
                      icon: ReceiptText
                    }
                  ]
                }
              : null,
            {
              displayOnly: true,
              path: '',
              title: <ZarplataActions />,
              icon: null
            }
          ])
        }
      : null,

    !is_super_admin && (permissions.jur3 || is_admin)
      ? {
          path: '/organization',
          title: `6-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_6').toLowerCase()}`,
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
              children: omitEmptyArrayElements<INavElement>([
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
                },
                import.meta.env.DEV
                  ? {
                      path: 'demo',
                      title: 'Demo',
                      icon: ShieldBan
                    }
                  : null
              ])
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.jur4 || is_admin)
      ? {
          path: '/accountable',
          title: `8-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_8').toLowerCase()}`,
          icon: UserSquare,
          children: omitEmptyArrayElements<INavElement>([
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
              path: 'work-trip',
              title: t('pages.work_trip'),
              icon: MapPinned
            },
            {
              path: 'saldo',
              title: t('pages.saldo'),
              icon: CircleFadingPlus
            }
            // {
            //   path: 'demo',
            //   title: 'Demo',
            //   icon: ShieldBan
            // }
          ])
        }
      : null,

    !is_super_admin && (permissions.jur7 || is_admin)
      ? {
          icon: NotepadText,
          path: '/journal-7',
          title: `9-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_9').toLowerCase()}`,
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
              path: 'internal',
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
          title: t('pages.jur_8_old'),
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
            },
            {
              path: 'headers',
              title: t('pages.headers'),
              icon: RemoveFormatting
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
          children: omitEmptyArrayElements<INavElement>([
            {
              path: 'video-tutorials',
              title: t('pages.video_tutorials'),
              icon: FileVideo
            },
            !is_revisor
              ? {
                  path: 'user',
                  title: t('pages.user'),
                  icon: Users
                }
              : null,
            {
              path: 'jur_1',
              title: `1-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_1').toLowerCase()}`,
              icon: BadgeDollarSign
            },
            {
              path: 'jur_2',
              title: `2-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_2').toLowerCase()}`,
              icon: Landmark
            },
            {
              path: '/jur_5',
              title: `5-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_5').toLowerCase()}`,
              icon: Receipt
            },
            {
              path: '/jur_3',
              title: `6-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_6').toLowerCase()}`,
              icon: Building2,
              children: [
                {
                  path: '159',
                  title: t('pages.akt'),
                  icon: FileCheck2
                },
                {
                  path: '152',
                  title: t('pages.service'),
                  icon: Wrench
                }
              ]
            },
            {
              path: '/jur_4',
              title: `8-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_8').toLowerCase()}`,
              icon: UserSquare
            },
            {
              icon: NotepadText,
              path: '/jur_7',
              title: `9-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_9').toLowerCase()}`
            },

            {
              path: 'mainbook',
              title: t('pages.mainbook'),
              icon: Book
            },
            {
              path: 'odinox',
              title: t('pages.odinox'),
              icon: Table2
            },
            {
              path: 'two-f',
              title: t('pages.two-f'),
              icon: Table2
            },
            {
              path: 'realcost',
              title: t('pages.realcost'),
              icon: WalletCards
            },
            !is_revisor
              ? {
                  path: 'logs',
                  title: t('pages.logs'),
                  icon: FileClock
                }
              : null,
            !is_revisor
              ? {
                  path: '',
                  title: t('pages.spravochnik'),
                  icon: NotebookTabs,
                  children: [
                    {
                      path: 'report-title',
                      title: t('pages.report_title'),
                      icon: LetterText
                    },
                    {
                      path: 'prixod-schets',
                      title: t('pages.prixod_schets'),
                      icon: Percent
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
                      path: 'zarplata/spravochnik',
                      title: t('pages.zarplata'),
                      icon: AppWindow
                    },
                    {
                      path: 'spravochnik/minimum-wage',
                      title: t('pages.bhm'),
                      icon: DollarSign
                    },
                    {
                      path: 'spravochnik/distance',
                      title: t('pages.distance'),
                      icon: Ruler
                    },
                    {
                      path: 'spravochnik/position',
                      title: t('pages.position'),
                      icon: BriefcaseBusiness
                    }
                  ]
                }
              : null
          ])
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
    !is_super_admin && (permissions.odinox || is_admin)
      ? {
          path: '/odinox',
          title: t('pages.odinox'),
          icon: Table2
        }
      : null,
    !is_super_admin && (permissions.odinox || is_admin)
      ? {
          path: '/two-f',
          title: t('pages.two-f'),
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
