import type { RoleAccess } from '@/common/models'
import type { ReactNode } from 'react'

import { Trans } from 'react-i18next'
import { z } from 'zod'

export const RoleAccessQueryKeys = {
  getAll: 'user-access/all',
  getById: 'user-access',
  update: 'user-access/update'
}

export const RoleAccessFormSchema = z.object({
  kassa: z.boolean(),
  bank: z.boolean(),
  jur3: z.boolean(),
  jur4: z.boolean(),
  jur5: z.boolean(),
  jur7: z.boolean(),
  jur8: z.boolean(),
  zarplata: z.boolean(),
  spravochnik: z.boolean(),
  region: z.boolean(),
  smeta_grafik: z.boolean(),
  odinox: z.boolean(),
  main_book: z.boolean()
})
export type RoleAccessFormValues = z.infer<typeof RoleAccessFormSchema>

export const roleAccessOptions: Array<{
  key: keyof Omit<RoleAccess, 'id' | 'role_name'>
  label: ReactNode
}> = [
  {
    key: 'kassa',
    label: <Trans ns="app">pages.kassa</Trans>
  },
  {
    key: 'bank',
    label: <Trans ns="app">pages.bank</Trans>
  },
  {
    key: 'jur3',
    label: <Trans ns="app">pages.organization</Trans>
  },
  {
    key: 'jur4',
    label: <Trans ns="app">pages.podotchet</Trans>
  },
  {
    key: 'zarplata',
    label: <Trans ns="app">pages.zarplata</Trans>
  },
  {
    key: 'jur7',
    label: <Trans ns="app">pages.material-warehouse</Trans>
  },
  {
    key: 'jur8',
    label: <Trans ns="app">pages.jur8</Trans>
  },
  {
    key: 'main_book',
    label: <Trans ns="app">pages.mainbook</Trans>
  },
  {
    key: 'region',
    label: <Trans ns="app">pages.region</Trans>
  },
  {
    key: 'spravochnik',
    label: <Trans ns="app">pages.spravochnik</Trans>
  },
  {
    key: 'smeta_grafik',
    label: <Trans ns="app">pages.smeta_grafik</Trans>
  },
  {
    key: 'odinox',
    label: <Trans ns="app">pages.odinox</Trans>
  }
]
