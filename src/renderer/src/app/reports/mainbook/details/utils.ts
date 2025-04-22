import type { MainbookFormValues } from './config'
import type { MainbookAutoFill, MainbookAutoFillSubChild, MainbookType } from './interfaces'
import type { EditableColumnDef } from '@/common/components/editable-table'
import type { Mainbook } from '@/common/models'

import { t } from 'i18next'

import { createNumberEditor } from '@/common/components/editable-table/editors'

export const transformMainbookAutoFillData = (types: MainbookAutoFill[]) => {
  const schetsMap = new Map<string, { id: number; child: MainbookAutoFillSubChild }[]>()

  types.forEach((type) => {
    type.sub_childs.push({
      rasxod: type.rasxod,
      prixod: type.prixod,
      schet: t('total')
    })
    type.sub_childs.forEach((subChild) => {
      if (!schetsMap.has(subChild.schet)) {
        schetsMap.set(subChild.schet, [])
      }
      schetsMap.get(subChild.schet)?.push({
        id: type.id,
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

export const transformGetByIdData = (types: Mainbook['childs']) => {
  const schetsMap = new Map<string, { id: number; child: MainbookAutoFillSubChild }[]>()

  types.forEach((type) => {
    type.sub_childs.push({
      id: type.type_id + Math.random(),
      rasxod: type.rasxod,
      prixod: type.prixod,
      schet: t('total')
    })
    type.sub_childs.forEach((subChild) => {
      if (!schetsMap.has(subChild.schet)) {
        schetsMap.set(subChild.schet, [])
      }
      schetsMap.get(subChild.schet)?.push({
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

export const transformMainbookAutoFillDataToSave = (
  types: MainbookType[],
  values: MainbookFormValues
) => {
  const payload: {
    type_id: number
    sub_childs: MainbookAutoFillSubChild[]
  }[] = []

  types?.forEach((type) => {
    payload.push({
      type_id: type.id,
      sub_childs: values.childs.map((child) => {
        return {
          schet: child.schet,
          prixod: child[`${type.id}_prixod`] || 0,
          rasxod: child[`${type.id}_rasxod`] || 0
        } as MainbookAutoFillSubChild
      })
    })
  })

  return payload
}

export const getMainbookColumns = (types: MainbookType[], isEditable = false) => {
  return (
    types?.flatMap((type) => {
      const jurNum = type.name.startsWith('jur')
        ? (type.name.match(/\d+/)?.[0] ?? undefined)
        : undefined
      const readOnly = isEditable && type.id === 10 ? false : true
      return [
        {
          key: type.id,
          header: jurNum
            ? t('reports_common.mo-nth', { nth: jurNum })
            : t(`reports_common.${type.name}`),
          headerClassName: 'text-center',
          columns: [
            {
              key: `${type.id}_prixod`,
              header: t('prixod'),
              headerClassName: 'text-center',
              minWidth: type.id === 10 && isEditable ? 160 : undefined,
              Editor: createNumberEditor({
                key: `${type.id}_prixod`,
                readOnly,
                defaultValue: 0,
                inputProps: {
                  adjustWidth: true
                }
              })
            },
            {
              key: `${type.id}_rasxod`,
              header: t('rasxod'),
              headerClassName: 'text-center',
              minWidth: type.id === 10 && isEditable ? 160 : undefined,
              Editor: createNumberEditor({
                key: `${type.id}_rasxod`,
                readOnly,
                defaultValue: 0,
                inputProps: {
                  adjustWidth: true
                }
              })
            }
          ]
        }
      ] as EditableColumnDef<any>[]
    }) ?? []
  )
}
