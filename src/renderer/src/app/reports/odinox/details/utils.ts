import type { OdinoxFormValues } from './config'
import type { EditableColumnDef } from '@/common/components/editable-table'
import type { Mainbook } from '@/common/models'

import { t } from 'i18next'

import { createNumberEditor } from '@/common/components/editable-table/editors'

import {
  type OdinoxAutoFill,
  type OdinoxAutoFillSubChild,
  type OdinoxType,
  OdinoxTypeName
} from './interfaces'

export const transformOdinoxAutoFillData = (types: OdinoxAutoFill[]) => {
  const schetsMap = new Map<number, { id: number; name: string; child: OdinoxAutoFillSubChild }[]>()

  types.forEach((type) => {
    type.sub_childs.push({
      id: 0,
      summa: type.summa,
      smeta_name: t('total'),
      smeta_number: '',
      group_number: '',
      smeta_grafik: '',
      smeta_id: 0
    })
    type.sub_childs.forEach((subChild) => {
      if (!schetsMap.has(subChild.smeta_id)) {
        schetsMap.set(subChild.smeta_id, [])
      }
      schetsMap.get(subChild.smeta_id)?.push({
        id: type.id,
        name: type.name,
        child: subChild
      })
    })
  })

  const rows: any[] = []
  schetsMap.forEach((types) => {
    const row = {}
    types.forEach(({ name, child }) => {
      row[name] = child.summa
      row['name'] = child.smeta_name
      row['number'] = child.smeta_number
    })
    rows.push(row)
  })

  return rows
}

export const transformGetByIdData = (types: Mainbook['childs']) => {
  const schetsMap = new Map<string, { id: number; child: OdinoxAutoFillSubChild }[]>()

  types.forEach((type) => {
    type.sub_childs.push({
      id: type.type_id + Math.random(),
      rasxod: type.rasxod,
      prixod: type.prixod,
      name: t('total'),
      number: ''
    })
    type.sub_childs.forEach((subChild) => {
      if (!schetsMap.has(subChild.number)) {
        schetsMap.set(subChild.number, [])
      }
      schetsMap.get(subChild.number)?.push({
        id: type.type_id,
        child: subChild
      })
    })
  })

  const rows: any[] = []
  schetsMap.forEach((types, schet) => {
    const row = {
      schet
    }
    types.forEach(({ id, child }) => {
      row[`${id}_rasxod`] = child.rasxod
      row[`${id}_prixod`] = child.prixod
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
    type_id: number
    sub_childs: OdinoxAutoFillSubChild[]
  }[] = []

  types?.forEach((type) => {
    payload.push({
      type_id: type.id,
      sub_childs: values.childs.map((child) => {
        return {
          name: child.name,
          number: child.number,
          prixod: child[`${type.id}_prixod`] || 0,
          rasxod: child[`${type.id}_rasxod`] || 0
        } as OdinoxAutoFillSubChild
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
            ? t('kassa_rasxod')
            : type.name.startsWith(OdinoxTypeName.Jur3)
              ? t('real_expenses')
              : t('remainder'),
      headerClassName: 'text-center py-3',
      Editor: createNumberEditor({
        key: type.name,
        readOnly: true,
        defaultValue: 0,
        inputProps: {
          adjustWidth: true
        }
      })
    }
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
      headerClassName: 'text-center',
      columns: types.filter((type) => type.name.endsWith('_year')).map(getColumns) as any
    }
  ] as EditableColumnDef<any>[]
}
