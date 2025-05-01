import type { OdinoxPayloadChild } from '../service'
import type { OdinoxFormValues } from './config'
import type { EditableColumnDef } from '@/common/components/editable-table'
import type { OdinoxProvodka } from '@/common/models'

import { t } from 'i18next'

import { createNumberEditor } from '@/common/components/editable-table/editors'
import { cn } from '@/common/lib/utils'

import {
  type OdinoxAutoFill,
  type OdinoxAutoFillSubChild,
  type OdinoxTableRow,
  type OdinoxType,
  OdinoxTypeName
} from './interfaces'

export const transformOdinoxAutoFillData = (types: OdinoxAutoFill[]) => {
  const smetaMap = new Map<
    number,
    {
      type_id: number
      type_name: string
      smeta: OdinoxAutoFillSubChild
    }[]
  >()

  types.forEach((type) => {
    type.sub_childs.push({
      id: 0,
      summa: type.summa,
      smeta_name: t('total'),
      smeta_number: '',
      group_number: ''
    } as OdinoxAutoFillSubChild)
    type.sub_childs.forEach((smeta) => {
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

  const rows: OdinoxTableRow[] = []
  smetaMap.forEach((types) => {
    const row = {} as OdinoxTableRow
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

export const transformGetByIdData = (types: OdinoxProvodka[]) => {
  const smetaMap = new Map<
    number,
    {
      type_id: number
      type_name: string
      smeta: OdinoxAutoFillSubChild
    }[]
  >()

  types.forEach((type) => {
    type.sub_childs.push({
      id: 0,
      summa: type.summa,
      smeta_name: t('total'),
      smeta_number: '',
      group_number: ''
    } as OdinoxAutoFillSubChild)
    type.sub_childs.forEach((smeta) => {
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

  const rows: OdinoxTableRow[] = []
  smetaMap.forEach((types) => {
    const row = {} as OdinoxTableRow
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

export const transformOdinoxAutoFillDataToSave = (
  types: OdinoxType[],
  values: OdinoxFormValues
) => {
  const payload: {
    name: string
    type_id: number
    sub_childs: OdinoxPayloadChild[]
  }[] = []

  types?.forEach((type) => {
    payload.push({
      type_id: type.id,
      name: type.name,
      sub_childs: values.rows.map((row) => {
        return {
          smeta_id: row.smeta_id,
          smeta_name: row.smeta_name,
          smeta_number: row.smeta_number,
          group_number: row.group_number,
          summa: row[type.name] ? Number(row[type.name]) : 0
        } satisfies OdinoxPayloadChild
      })
    })
  })

  return payload
}

export const getOdinoxColumns = (types: OdinoxType[]) => {
  const getColumns = (type: OdinoxType) => {
    return {
      key: type.name,
      header: type.name.startsWith(OdinoxTypeName.Grafik)
        ? t('allocated_funds')
        : type.name.startsWith(OdinoxTypeName.BankPrixod)
          ? t('funds_paid_by_ministry')
          : type.name.startsWith(OdinoxTypeName.Jur1_2)
            ? `${t('kassa_rasxod')} / ${t('bank_rasxod')}`
            : type.name.startsWith(OdinoxTypeName.Jur3)
              ? t('real_expenses')
              : t('remainder'),
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
