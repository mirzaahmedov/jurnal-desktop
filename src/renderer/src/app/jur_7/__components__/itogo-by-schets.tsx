import type { TFunction } from 'i18next'

import { GenericTable } from '@/common/components'
import { formatNumber } from '@/common/lib/format'

export interface ItogoBySchetsRow {
  schet: string
  prixod_summa: number
  rasxod_summa: number
  itogo_summa: number
}

export interface ItogoBySchetsProps {
  rows: ItogoBySchetsRow[]
}
export const ItogoBySchets = ({ rows }: ItogoBySchetsProps) => {
  return (
    <GenericTable
      columnDefs={[
        {
          key: 'schet',
          header: 'schet',
          width: '25%'
        },
        {
          numeric: true,
          key: 'prixod_summa',
          header: 'debet',
          width: '25%',
          renderCell: (row) => <b className="font-black">{formatNumber(row.prixod_summa)}</b>
        },
        {
          numeric: true,
          key: 'rasxod_summa',
          header: 'kredit',
          width: '25%',
          renderCell: (row) => <b className="font-black">{formatNumber(row.rasxod_summa)}</b>
        },
        {
          numeric: true,
          key: 'itogo_summa',
          header: 'total',
          width: '25%',
          renderCell: (row) => <b className="font-black">{formatNumber(row.itogo_summa)}</b>
        }
      ]}
      data={rows}
      getRowKey={(row) => row.schet}
      className="mt-5 table-generic-xs"
    />
  )
}

export const getItogoBySchets = (childs: any[], t: TFunction) => {
  const itogo = {
    schet: t('total'),
    prixod_summa: 0,
    rasxod_summa: 0,
    itogo_summa: 0
  }
  const uniqueSchets = new Set([
    ...childs.map((child) => child.debet_schet).filter(Boolean),
    ...childs.map((child) => child.kredit_schet).filter(Boolean)
  ])
  const rows = Array.from(uniqueSchets).map((schet) => {
    const prixodSumma = childs
      .filter((child) => child.debet_schet === schet)
      .reduce((acc, child) => acc + child.summa, 0)
    const rasxodSumma = childs
      .filter((child) => child.kredit_schet === schet)
      .reduce((acc, child) => acc + child.summa, 0)
    itogo.prixod_summa += prixodSumma
    itogo.rasxod_summa += rasxodSumma
    itogo.itogo_summa += prixodSumma - rasxodSumma
    return {
      schet,
      prixod_summa: prixodSumma,
      rasxod_summa: rasxodSumma,
      itogo_summa: prixodSumma - rasxodSumma
    } satisfies ItogoBySchetsRow
  })
  rows.push(itogo)
  return rows
}
