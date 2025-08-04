import type { EditableColumnDef } from '@/common/components/editable-table'
import type { ApiResponseMeta, TwoFProvodka } from '@/common/models'

import { t } from 'i18next'

import { createNumberEditor } from '@/common/components/editable-table/editors'
import { cn } from '@/common/lib/utils'

import {
  type TwoFAutoFill,
  type TwoFAutoFillSubChild,
  type TwoFTableRow,
  type TwoFType,
  TwoFTypeName
} from './interfaces'

export interface TwoFMeta extends ApiResponseMeta {
  title: string
  title_summa: number
  title_rasxod_summa: number
  summa_from: number
  summa_to: number
}

export const transformTwoFAutoFillData = (
  types: TwoFAutoFill[],
  meta: Omit<TwoFMeta, keyof ApiResponseMeta>
) => {
  const smetaMap = new Map<
    number,
    {
      type_id: number
      type_name: string
      smeta: TwoFAutoFillSubChild
    }[]
  >()

  types.forEach((type) => {
    const sub_childs = [
      {
        id: -1,
        summa:
          type.name === TwoFTypeName.BankPrixod
            ? meta.title_summa
            : type.name === TwoFTypeName.Saldo
              ? meta.summa_from
              : type.name === TwoFTypeName.Jur1_2
                ? meta.title_rasxod_summa
                : 0,
        smeta_id: -1,
        smeta_name: meta.title,
        smeta_number: '',
        group_number: ''
      },
      ...type.sub_childs,
      {
        id: 0,
        summa: type.name === TwoFTypeName.Saldo ? meta.summa_to : type.summa,
        smeta_id: 0,
        smeta_name: t('total'),
        smeta_number: '',
        group_number: ''
      }
    ]

    sub_childs.forEach((smeta) => {
      if (!smetaMap.has(smeta.smeta_id)) {
        smetaMap.set(smeta.smeta_id, [])
      }
      smetaMap.get(smeta.smeta_id)?.push({
        type_id: type.id,
        type_name: type.name,
        smeta
      })
    })
  })

  const rows: TwoFTableRow[] = []
  smetaMap.forEach((types) => {
    const row = {} as TwoFTableRow
    types.forEach(({ type_name, smeta }) => {
      row[type_name] = smeta.summa

      row.smeta_id = smeta.smeta_id
      row.smeta_name = smeta.smeta_name
      row.smeta_number = smeta.smeta_number
      row.group_number = smeta.group_number
    })
    rows.push(row)
  })

  return rows
}

export const transformGetByIdData = (
  types: TwoFProvodka[],
  meta: Omit<TwoFMeta, keyof ApiResponseMeta>
) => {
  const smetaMap = new Map<
    number,
    {
      type_id: number
      type_name: string
      smeta: TwoFAutoFillSubChild
    }[]
  >()

  types.forEach((type) => {
    const sub_childs = [
      {
        id: -1,
        summa:
          type.type_name === TwoFTypeName.BankPrixod
            ? meta.title_summa
            : type.type_name === TwoFTypeName.Saldo
              ? meta.summa_from
              : type.type_name === TwoFTypeName.Jur1_2
                ? meta.title_rasxod_summa
                : 0,
        smeta_id: -1,
        smeta_name: meta.title,
        smeta_number: '',
        group_number: ''
      },
      ...type.sub_childs,
      {
        id: 0,
        summa: type.type_name === TwoFTypeName.Saldo ? meta.summa_to : type.summa,
        smeta_id: 0,
        smeta_name: t('total'),
        smeta_number: '',
        group_number: ''
      }
    ]

    sub_childs.forEach((smeta) => {
      if (!smetaMap.has(smeta.smeta_id)) {
        smetaMap.set(smeta.smeta_id, [])
      }
      smetaMap.get(smeta.smeta_id)?.push({
        type_id: type.type_id,
        type_name: type.type_name,
        smeta
      })
    })
  })

  const rows: TwoFTableRow[] = []
  smetaMap.forEach((types) => {
    const row = {} as TwoFTableRow
    types.forEach(({ type_name, smeta }) => {
      row[type_name] = smeta.summa

      row.smeta_id = smeta.smeta_id
      row.smeta_name = smeta.smeta_name
      row.smeta_number = smeta.smeta_number
      row.group_number = smeta.group_number
    })
    rows.push(row)
  })

  return rows
}

export const getTwoFColumns = (types: TwoFType[]) => {
  const getColumns = (type: TwoFType) => {
    return {
      key: type.name,
      header: type.name.startsWith(TwoFTypeName.Grafik)
        ? t('allocated_funds')
        : type.name.startsWith(TwoFTypeName.BankPrixod)
          ? t('funds_paid_by_ministry')
          : type.name.startsWith(TwoFTypeName.Jur1_2)
            ? `${t('provodka_type.bank_rasxod')}, ${t('provodka_type.bank_prixod')}, ${t('provodka_type.kassa_prixod')}`
            : type.name.startsWith(TwoFTypeName.Jur3)
              ? t('real_expenses')
              : type.name.startsWith('remaining')
                ? t('remainder')
                : type.name === 'saldo'
                  ? t('saldo_for_month')
                  : type.name,
      headerClassName: cn(
        'text-center py-3',
        type.name.endsWith('_year') && '!bg-slate-200 border-slate-300'
      ),
      minWidth: 120,
      Editor: createNumberEditor({
        key: type.name,
        readOnly: true,
        defaultValue: 0,
        inputProps: {
          adjustWidth: true
        }
      })
    } satisfies EditableColumnDef<any>
  }

  return [
    {
      key: 'month',
      header: t('for_month'),
      headerClassName: 'text-center',
      columns: types.filter((type) => !type.name.endsWith('_year')).map(getColumns) as any
    },
    {
      key: 'year',
      header: t('for_year'),
      headerClassName: 'text-center !bg-slate-200 border-slate-300',
      columns: types.filter((type) => type.name.endsWith('_year')).map(getColumns) as any
    }
  ] as EditableColumnDef<any>[]
}
