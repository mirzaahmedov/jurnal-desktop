import { z } from 'zod'

export const accessQueryKeys = {
  getAll: 'access/all',
  getById: 'access',
  update: 'access/update'
}

export const AccessPayloadSchema = z.object({
  kassa: z.boolean(),
  bank: z.boolean(),
  spravochnik: z.boolean(),
  organization_monitoring: z.boolean(),
  region_users: z.boolean(),
  smeta: z.boolean(),
  role: z.boolean(),
  region: z.boolean(),
  users: z.boolean(),
  shartnoma: z.boolean(),
  jur3: z.boolean(),
  jur4: z.boolean(),
  jur152: z.boolean(),
  jur7: z.boolean(),
  budjet: z.boolean(),
  access: z.boolean(),
  smeta_grafik: z.boolean(),
  podotchet_monitoring: z.boolean()
})
export type AccessPayloadType = z.infer<typeof AccessPayloadSchema>

export type AccessOptionType = {
  key: keyof AccessPayloadType
  label: string
}
export const accessOptions: AccessOptionType[] = [
  { key: 'access', label: 'Доступ' },
  { key: 'kassa', label: 'Касса' },
  { key: 'bank', label: 'Банк' },
  { key: 'budjet', label: 'Бюджет' },
  { key: 'smeta_grafik', label: 'Смета график' },
  { key: 'spravochnik', label: 'Справочник' },
  { key: 'organization_monitoring', label: 'Об организации' },
  { key: 'users', label: 'Пользователи' },
  { key: 'region_users', label: 'Региональные пользователи' },
  { key: 'role', label: 'Роли' },
  { key: 'smeta', label: 'Смета' },
  { key: 'region', label: 'Регион' },
  { key: 'shartnoma', label: 'Договор' },
  { key: 'jur3', label: 'Акт-приём пересдач' },
  { key: 'jur4', label: 'Авансовые отчёты' },
  { key: 'jur152', label: 'Показать услуги' },
  { key: 'jur7', label: '№7 - МО (Материальный склад)' },
  { key: 'podotchet_monitoring', label: 'О подотчетном лице ' }
]
