import type { MainbookAutoFill, MainbookAutoFillSubChild, MainbookType } from './service'
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

export const getMainbookColumns = (types: MainbookType[]) => {
  return (
    types?.flatMap((type) => {
      const jurNum = type.name.match(/\d+/)?.[0]
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
              // width: 120,
              // minWidth: 120,
              header: t('prixod'),
              headerClassName: 'text-center',
              Editor: createNumberEditor({
                key: `${type.id}_prixod`,
                readOnly: true,
                defaultValue: 0,
                inputProps: {
                  adjustWidth: true
                }
              })
            },
            {
              key: `${type.id}_rasxod`,
              // width: 120,
              // minWidth: 120,
              header: t('rasxod'),
              headerClassName: 'text-center',
              Editor: createNumberEditor({
                key: `${type.id}_rasxod`,
                readOnly: true,
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
