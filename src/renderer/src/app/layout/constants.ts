import {
  ArrowLeftRight,
  BadgeDollarSign,
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
  House,
  Landmark,
  LayoutGrid,
  MapPinHouse,
  MonitorCog,
  NotebookTabs,
  NotebookText,
  NotepadText,
  Percent,
  ReceiptText,
  ShieldCheck,
  Signature,
  SquareActivity,
  SquareUser,
  Truck,
  UserCog,
  UserSquare,
  Users,
  Wallet,
  Weight
} from 'lucide-react'

import type { Access } from '@/common/models'
import type { ComponentType } from 'react'
import { adminRoles } from '@renderer/app/super-admin/role'
import { omitEmptyArrayElements } from '@/common/lib/validation'
import { useAuthStore } from '@/common/features/auth'

export type NavElement = {
  title: string
  path: string
  icon: ComponentType<any>
  children?: NavElement[]
}

export const getNavElements = (): NavElement[] => {
  const user = useAuthStore.getState().user
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
      path: '/',
      title: 'Главная книга',
      icon: House
    },
    permissions.kassa
      ? {
          path: '/kassa',
          title: '№1 - МО (Касса)',
          icon: BadgeDollarSign,
          children: [
            {
              path: 'monitor',
              title: 'Мониторинг',
              icon: SquareActivity
            },
            {
              path: 'prixod',
              title: 'Приходные документы',
              icon: FileDown
            },
            {
              path: 'rasxod',
              title: 'Расходные документы',
              icon: FileUp
            }
          ]
        }
      : null,
    permissions.bank
      ? {
          path: '/bank',
          title: '№2 - МО (Банк)',
          icon: Landmark,
          children: [
            {
              path: 'monitor',
              title: 'Мониторинг',
              icon: SquareActivity
            },
            {
              path: 'prixod',
              title: 'Приходные документы',
              icon: FileDown
            },
            {
              path: 'rasxod',
              title: 'Расходные документы',
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
          title: '№3 - МО (Организация)',
          icon: Building2,
          children: omitEmptyArrayElements([
            permissions.organization_monitoring
              ? {
                  path: 'monitor',
                  title: 'Об организации',
                  icon: CircleHelp
                }
              : null,
            permissions.shartnoma
              ? {
                  path: 'shartnoma',
                  title: 'Договор',
                  icon: ReceiptText
                }
              : null,
            permissions.shartnoma
              ? {
                  path: 'shartnoma-grafik',
                  title: 'График договорах',
                  icon: CalendarCheck
                }
              : null,
            permissions.jur3
              ? {
                  path: 'akt',
                  title: 'Акт-приём пересдач',
                  icon: FileCheck2
                }
              : null,
            permissions.jur152
              ? {
                  path: 'pokazat-uslugi',
                  title: 'Показать услуги',
                  icon: Truck
                }
              : null
          ])
        }
      : null,
    [permissions.podotchet_monitoring, permissions.jur4].includes(true)
      ? {
          path: '/accountable',
          title: '№4 - МО (Подотчетные Отчеты)',
          icon: UserSquare,
          children: omitEmptyArrayElements([
            permissions.podotchet_monitoring
              ? {
                  path: 'monitor',
                  title: 'О подотчетном лице',
                  icon: CircleHelp
                }
              : null,
            permissions.jur4
              ? {
                  path: 'advance-report',
                  title: 'Авансовые отчёты',
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
          title: '№7 - МО (Материальный склад)',
          children: [
            {
              icon: FileDown,
              path: 'prixod',
              title: 'Приходный документ'
            },
            {
              icon: FileUp,
              path: 'rasxod',
              title: 'Расходный документ'
            },
            {
              icon: ArrowLeftRight,
              path: 'internal-transfer',
              title: 'Внутрь. Пере. Документ'
            },
            // {
            //   path: 'denomination',
            //   title: 'Наименование',
            //   icon: ListTodo
            // },
            {
              path: 'responsible',
              title: 'Ответственное лицо',
              icon: UserSquare
            },
            {
              path: 'subdivision-7',
              title: 'Подразделение',
              icon: Building
            }
          ]
        }
      : null,
    permissions.spravochnik
      ? {
          path: '/spravochnik',
          title: 'Справочник',
          icon: NotebookTabs,
          children: [
            {
              path: 'organization',
              title: 'Организация',
              icon: Building
            },
            {
              path: 'subdivision',
              title: 'Подразделение',
              icon: Building2
            },
            {
              path: 'operation-type',
              title: 'Типы операции',
              icon: Folder
            },
            {
              path: 'main-schet',
              title: 'Основной счет',
              icon: Wallet
            },
            {
              path: 'podotchet',
              title: 'Подотчетное лицо',
              icon: SquareUser
            },
            {
              path: 'sostav',
              title: 'Состав',
              icon: Users
            },
            {
              path: 'smeta-grafik',
              title: 'Смета график',
              icon: CalendarCheck
            },
            {
              path: 'podpis',
              title: 'Подпись',
              icon: Signature
            }
          ]
        }
      : null,
    is_admin && [permissions.region_users, permissions.access].includes(true)
      ? {
          path: '/region',
          title: 'Регион',
          icon: MapPinHouse,
          children: omitEmptyArrayElements([
            permissions.region_users
              ? {
                  path: 'user',
                  title: 'Пользователь',
                  icon: Users
                }
              : null,
            permissions.access
              ? {
                  path: 'access',
                  title: 'Доступ',
                  icon: ShieldCheck
                }
              : null
          ])
        }
      : null,
    is_super_admin
      ? {
          path: '/admin',
          title: 'Админ',
          icon: UserCog,
          children: omitEmptyArrayElements([
            {
              path: 'main-book',
              title: 'Главная книга',
              icon: NotebookText
            },
            {
              path: 'logs',
              title: 'Логи',
              icon: FileClock
            },
            {
              path: 'pereotsenka',
              title: 'Переоценка',
              icon: ChartCandlestick
            },
            {
              path: 'group',
              title: 'Группа',
              icon: Group
            },
            {
              path: 'bank',
              title: 'Банк',
              icon: Building
            },
            permissions.region
              ? {
                  path: 'region',
                  title: 'Регион',
                  icon: LayoutGrid
                }
              : null,
            permissions.role
              ? {
                  path: 'role',
                  title: 'Роль',
                  icon: MonitorCog
                }
              : null,
            permissions.users
              ? {
                  path: 'user',
                  title: 'Пользователь',
                  icon: Users
                }
              : null,
            permissions.smeta
              ? {
                  path: 'smeta',
                  title: 'Смета',
                  icon: CircleFadingPlus
                }
              : null,
            permissions.budjet
              ? {
                  path: 'budget',
                  title: 'Бюджеты',
                  icon: CircleDollarSign
                }
              : null,
            {
              path: 'operation',
              title: 'Операции',
              icon: Percent
            },
            {
              path: 'unit',
              title: 'Единица измерения',
              icon: Weight
            }
          ])
        }
      : null,
    !is_super_admin
      ? {
          path: '/main-book',
          title: 'Главный книга',
          icon: NotebookText,
          children: [
            {
              path: 'create-monthly-report',
              title: 'Создать месячный отчёт',
              icon: CalendarPlus2
            },
            {
              path: 'close-monthly-report',
              title: 'Закрыть месячный отчёт',
              icon: CalendarX
            }
          ]
        }
      : null,
    {
      path: '/region-data',
      title: 'Проверка данных',
      icon: Database
    }
  ])
}
