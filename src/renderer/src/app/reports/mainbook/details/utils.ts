import type { MainbookAutoFill, MainbookAutoFillSubChild } from './service'
import type { Mainbook } from '@renderer/common/models'

import { t } from 'i18next'

export const transformMainbookAutoFillData = (types: MainbookAutoFill[]) => {
  const schetsMap = new Map<string, { id: number; child: MainbookAutoFillSubChild }[]>()

  types.forEach((type) => {
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
