import type { RoleAccess } from '@/common/models'
import type { TFunction } from 'i18next'
import type { ComponentType, HTMLAttributes, ReactNode } from 'react'

import {
  BankIcon,
  BookIcon,
  BriefcaseIcon,
  BuildingApartmentIcon,
  BuildingOfficeIcon,
  CalculatorIcon,
  CalendarCheckIcon,
  ChatsCircleIcon,
  CheckSquareIcon,
  CheckSquareOffsetIcon,
  CreditCardIcon,
  CurrencyCircleDollarIcon,
  CurrencyDollarIcon,
  DatabaseIcon,
  FileArrowDownIcon,
  FileArrowUpIcon,
  FolderSimpleIcon,
  GearIcon,
  IdentificationCardIcon,
  MapPinAreaIcon,
  MicrosoftExcelLogoIcon,
  MoneyIcon,
  MonitorIcon,
  NewspaperIcon,
  NotebookIcon,
  PercentIcon,
  PlusMinusIcon,
  RulerIcon,
  ScalesIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SignatureIcon,
  SquaresFourIcon,
  SwapIcon,
  TableIcon,
  TerminalWindowIcon,
  TextTIcon,
  UserGearIcon,
  UserSquareIcon,
  UsersIcon,
  VideoIcon,
  WalletIcon,
  WarehouseIcon,
  WrenchIcon
} from '@phosphor-icons/react'

import { KassaSaldoController } from '@/app/jur_1/saldo/components/saldo-controller'
import { BankSaldoController } from '@/app/jur_2/saldo/components/saldo-controller'
import { WarehouseSaldoController } from '@/app/jur_7/saldo/components/saldo-controller'
import { AdminRoles } from '@/app/super-admin/role'
import { useAuthStore } from '@/common/features/auth'
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
  const user = useAuthStore.getState().user
  const permissions =
    user?.acesses?.find((access) => access.budjet_id === budjetId) ?? ({} as RoleAccess)

  const is_super_admin = user?.role_name === AdminRoles.super_admin
  const is_admin = user?.role_name === AdminRoles.region_admin
  const is_revisor = user?.login === 'revizor'

  return omitEmptyArrayElements<INavElement>([
    {
      path: is_super_admin ? '/admin/dashboard' : '/region/dashboard',
      title: t('pages.main'),
      icon: SquaresFourIcon
    },
    !is_super_admin
      ? {
          path: '/video-tutorials',
          title: t('pages.video_tutorials'),
          icon: VideoIcon
        }
      : null,
    !is_super_admin && (permissions.kassa || is_admin)
      ? {
          path: '/kassa',
          title: `1-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_1').toLowerCase()}`,
          icon: CurrencyCircleDollarIcon,
          children: [
            {
              path: 'monitor',
              title: t('pages.monitoring'),
              icon: MonitorIcon
            },
            {
              path: 'prixod',
              title: t('pages.prixod-docs'),
              icon: FileArrowDownIcon
            },
            {
              path: 'rasxod',
              title: t('pages.rasxod-docs'),
              icon: FileArrowUpIcon
            },
            {
              path: 'ostatok',
              title: t('pages.saldo'),
              icon: PlusMinusIcon
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
          icon: BankIcon,
          children: [
            {
              path: 'monitor',
              title: t('pages.monitoring'),
              icon: MonitorIcon
            },
            {
              path: 'prixod',
              title: t('pages.prixod-docs'),
              icon: FileArrowDownIcon
            },
            {
              path: 'rasxod',
              title: t('pages.rasxod-docs'),
              icon: FileArrowUpIcon
            },
            {
              path: 'ostatok',
              title: t('pages.saldo'),
              icon: PlusMinusIcon
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
          icon: CreditCardIcon,
          children: omitEmptyArrayElements<INavElement>([
            permissions.zarplata_1 || is_admin
              ? {
                  path: 'staffing_table',
                  title: t('pages.staffing_table'),
                  icon: CheckSquareIcon
                }
              : null,
            permissions.zarplata_2 || is_admin
              ? {
                  path: 'calculate-params',
                  title: t('pages.calc_parameters'),
                  icon: GearIcon
                }
              : null,
            permissions.zarplata_3 || is_admin
              ? {
                  path: 'passport-info',
                  title: t('pages.passport_details'),
                  icon: IdentificationCardIcon
                }
              : null,
            permissions.zarplata_4 || is_admin
              ? {
                  path: 'nachislenie',
                  title: t('pages.nachislenie'),
                  icon: CalculatorIcon
                }
              : null,
            permissions.zarplata_5 || is_admin
              ? {
                  path: 'payment-type',
                  title: t('pages.payment_type'),
                  icon: FolderSimpleIcon,
                  children: [
                    {
                      path: 'payments',
                      title: t('pages.payments'),
                      icon: CheckSquareIcon
                    },
                    {
                      path: 'deductions',
                      title: t('pages.deductions'),
                      icon: CheckSquareIcon
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
          icon: BuildingOfficeIcon,
          children: [
            {
              path: 'shartnoma',
              title: t('pages.shartnoma'),
              icon: NewspaperIcon
            },
            {
              path: '159',
              title: t('pages.akt'),
              icon: CheckSquareOffsetIcon,
              children: [
                {
                  path: 'monitor',
                  title: t('pages.monitoring'),
                  icon: MonitorIcon
                },
                {
                  path: 'akt',
                  title: t('pages.schet_faktura'),
                  icon: CheckSquareOffsetIcon
                },
                {
                  path: 'saldo',
                  title: t('pages.saldo'),
                  icon: PlusMinusIcon
                }
              ]
            },
            {
              path: '152',
              title: t('pages.service'),
              icon: WrenchIcon,
              children: omitEmptyArrayElements<INavElement>([
                {
                  path: 'monitor',
                  title: t('pages.monitoring'),
                  icon: MonitorIcon
                },
                {
                  path: 'pokazat-uslugi',
                  title: t('pages.schet_faktura'),
                  icon: WrenchIcon
                },
                {
                  path: 'saldo',
                  title: t('pages.saldo'),
                  icon: PlusMinusIcon
                },
                import.meta.env.DEV
                  ? {
                      path: 'demo',
                      title: 'Demo',
                      icon: ShieldIcon
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
          icon: UserSquareIcon,
          children: omitEmptyArrayElements<INavElement>([
            {
              path: 'monitor',
              title: t('pages.monitoring'),
              icon: MonitorIcon
            },
            {
              path: 'advance-report',
              title: t('pages.avans'),
              icon: MoneyIcon
            },
            {
              path: 'work-trip',
              title: t('pages.work_trip'),
              icon: MapPinAreaIcon
            },
            {
              path: 'saldo',
              title: t('pages.saldo'),
              icon: PlusMinusIcon
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
          icon: NotebookIcon,
          path: '/journal-7',
          title: `9-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_9').toLowerCase()}`,
          children: [
            {
              icon: MonitorIcon,
              path: 'monitor',
              title: t('pages.monitoring')
            },
            {
              icon: FileArrowDownIcon,
              path: 'prixod',
              title: t('pages.prixod-docs')
            },
            {
              icon: FileArrowUpIcon,
              path: 'rasxod',
              title: t('pages.rasxod-docs')
            },
            {
              icon: SwapIcon,
              path: 'internal',
              title: t('pages.internal-docs')
            },
            {
              path: 'responsible',
              title: t('pages.responsible'),
              icon: UserSquareIcon
            },
            {
              path: 'subdivision-7',
              title: t('pages.podrazdelenie'),
              icon: FolderSimpleIcon
            },
            {
              path: 'ostatok',
              title: t('pages.saldo'),
              icon: WarehouseIcon
            },
            {
              path: 'iznos',
              title: t('pages.iznos'),
              icon: PercentIcon
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
          icon: NotebookIcon,
          path: '/jur_8',
          title: t('pages.jur_8_old'),
          children: [
            {
              icon: MonitorIcon,
              path: 'monitor',
              title: t('pages.monitoring')
            },
            {
              icon: GearIcon,
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
          icon: GearIcon,
          children: [
            {
              path: 'organization',
              title: t('pages.organization'),
              icon: BuildingOfficeIcon
            },
            {
              path: 'subdivision',
              title: t('pages.podrazdelenie'),
              icon: FolderSimpleIcon
            },
            {
              path: 'operation-type',
              title: t('pages.type-operatsii'),
              icon: FolderSimpleIcon
            },
            {
              path: 'main-schet',
              title: t('pages.main-schet'),
              icon: WalletIcon
            },
            {
              path: 'podotchet',
              title: t('pages.podotchet-litso'),
              icon: UserSquareIcon
            },
            {
              path: 'sostav',
              title: t('pages.sostav'),
              icon: UsersIcon
            },
            {
              path: 'group',
              title: t('pages.group'),
              icon: FolderSimpleIcon
            },
            {
              path: 'podpis',
              title: t('pages.podpis'),
              icon: SignatureIcon
            },
            {
              path: 'headers',
              title: t('pages.headers'),
              icon: TextTIcon
            }
          ]
        }
      : null,
    !is_super_admin && (permissions.region || is_admin)
      ? {
          path: '/region',
          title: t('pages.region'),
          icon: BuildingApartmentIcon,
          children: [
            {
              path: 'user',
              title: t('pages.user'),
              icon: UsersIcon
            },
            {
              path: 'role-access',
              title: t('pages.access_rights'),
              icon: ShieldCheckIcon
            },
            {
              path: 'vacant',
              title: t('pages.vacant'),
              icon: UserSquareIcon
            }
          ]
        }
      : null,
    is_super_admin
      ? {
          path: '/admin',
          title: t('pages.admin'),
          icon: UserGearIcon,
          children: omitEmptyArrayElements<INavElement>([
            {
              path: 'video-tutorials',
              title: t('pages.video_tutorials'),
              icon: VideoIcon
            },
            !is_revisor
              ? {
                  path: 'user',
                  title: t('pages.user'),
                  icon: UsersIcon
                }
              : null,
            {
              path: 'jur_1',
              title: `1-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_1').toLowerCase()}`,
              icon: CurrencyCircleDollarIcon
            },
            {
              path: 'jur_2',
              title: `2-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_2').toLowerCase()}`,
              icon: BankIcon
            },
            {
              path: '/jur_5',
              title: `5-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_5').toLowerCase()}`,
              icon: CreditCardIcon
            },
            {
              path: '/jur_3',
              title: `6-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_6').toLowerCase()}`,
              icon: BuildingOfficeIcon,
              children: [
                {
                  path: '159',
                  title: t('pages.akt'),
                  icon: CheckSquareOffsetIcon
                },
                {
                  path: '152',
                  title: t('pages.service'),
                  icon: WrenchIcon
                }
              ]
            },
            {
              path: '/jur_4',
              title: `8-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_8').toLowerCase()}`,
              icon: UserSquareIcon
            },
            {
              icon: NotebookIcon,
              path: '/jur_7',
              title: `9-${t('pages.memorial_order').toLowerCase()} — ${t('pages.jur_9').toLowerCase()}`
            },

            {
              path: 'mainbook',
              title: t('pages.mainbook'),
              icon: BookIcon
            },
            {
              path: 'odinox',
              title: t('pages.odinox'),
              icon: MicrosoftExcelLogoIcon
            },
            {
              path: 'two-f',
              title: t('pages.two-f'),
              icon: MicrosoftExcelLogoIcon
            },
            {
              path: 'realcost',
              title: t('pages.realcost'),
              icon: MicrosoftExcelLogoIcon
            },
            !is_revisor
              ? {
                  path: 'feedback',
                  title: t('pages.feedback'),
                  icon: ChatsCircleIcon
                }
              : null,
            !is_revisor
              ? {
                  path: 'logs',
                  title: t('pages.logs'),
                  icon: TerminalWindowIcon
                }
              : null,
            !is_revisor
              ? {
                  path: '',
                  title: t('pages.spravochnik'),
                  icon: GearIcon,
                  children: [
                    {
                      path: 'report-title',
                      title: t('pages.report_title'),
                      icon: TextTIcon
                    },
                    {
                      path: 'prixod-schets',
                      title: t('pages.prixod_schets'),
                      icon: PercentIcon
                    },
                    {
                      path: 'pereotsenka',
                      title: t('pages.pereotsenka'),
                      icon: TableIcon
                    },
                    {
                      path: 'group',
                      title: t('pages.group'),
                      icon: FolderSimpleIcon
                    },
                    {
                      path: 'bank',
                      title: t('pages.bank'),
                      icon: BankIcon
                    },
                    {
                      path: 'region',
                      title: t('pages.region'),
                      icon: BuildingApartmentIcon
                    },
                    {
                      path: 'role',
                      title: t('pages.role'),
                      icon: UserGearIcon
                    },
                    {
                      path: 'smeta',
                      title: t('pages.smeta'),
                      icon: PlusMinusIcon
                    },
                    {
                      path: 'budget',
                      title: t('pages.budjets'),
                      icon: WalletIcon
                    },
                    {
                      path: 'operation',
                      title: t('pages.operatsii'),
                      icon: PercentIcon
                    },
                    {
                      path: 'unit',
                      title: t('pages.edin'),
                      icon: ScalesIcon
                    },
                    {
                      path: 'zarplata/spravochnik',
                      title: t('pages.zarplata'),
                      icon: FolderSimpleIcon
                    },
                    {
                      path: 'spravochnik/minimum-wage',
                      title: t('pages.bhm'),
                      icon: CurrencyDollarIcon
                    },
                    {
                      path: 'spravochnik/distance',
                      title: t('pages.distance'),
                      icon: RulerIcon
                    },
                    {
                      path: 'spravochnik/position',
                      title: t('pages.position'),
                      icon: BriefcaseIcon
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
          icon: CalendarCheckIcon
        }
      : null,
    !is_super_admin && (permissions.main_book || is_admin)
      ? {
          path: '/mainbook',
          title: t('pages.mainbook'),
          icon: BookIcon
        }
      : null,
    !is_super_admin && (permissions.odinox || is_admin)
      ? {
          path: '/odinox',
          title: t('pages.odinox'),
          icon: MicrosoftExcelLogoIcon
        }
      : null,
    !is_super_admin && (permissions.odinox || is_admin)
      ? {
          path: '/two-f',
          title: t('pages.two-f'),
          icon: MicrosoftExcelLogoIcon
        }
      : null,
    !is_super_admin
      ? {
          path: '/realcost',
          title: t('pages.realcost'),
          icon: MicrosoftExcelLogoIcon
        }
      : null,
    {
      path: '/region-data',
      title: t('pages.region-data'),
      icon: DatabaseIcon
    },
    import.meta.env.DEV
      ? {
          path: '/demo',
          title: 'Demo',
          icon: ShieldIcon
        }
      : null
  ])
}
