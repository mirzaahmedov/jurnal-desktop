interface IProduct {
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  summa: number
}
const mockProducts: IProduct[] = [
  {
    debet_schet: '03',
    debet_sub_schet: '03-001',
    kredit_schet: '53',
    summa: 1000 // Duplicate of earlier
  },
  {
    debet_schet: '01',
    debet_sub_schet: '01-001',
    kredit_schet: '50',
    summa: 1000
  },
  {
    debet_schet: '01',
    debet_sub_schet: '01-001',
    kredit_schet: '50',
    summa: 1000 // Duplicate of first
  },
  {
    debet_schet: '01',
    debet_sub_schet: '01-002',
    kredit_schet: '50',
    summa: 1000 // Similar to first but different sub_schet
  },
  {
    debet_schet: '02',
    debet_sub_schet: '02-001',
    kredit_schet: '51',
    summa: 1000
  },
  {
    debet_schet: '02',
    debet_sub_schet: '02-001',
    kredit_schet: '51',
    summa: 1000 // Duplicate of above
  },
  {
    debet_schet: '02',
    debet_sub_schet: '02-001',
    kredit_schet: '52',
    summa: 1000 // Similar: only kredit_schet differs
  },
  {
    debet_schet: '03',
    debet_sub_schet: '03-001',
    kredit_schet: '53',
    summa: 1000
  },
  {
    debet_schet: '03',
    debet_sub_schet: '03-002',
    kredit_schet: '53',
    summa: 1000 // Similar to above
  }
]
export const groupAndSumProvodka = (products: IProduct[]) => {
  const grouped = products.reduce(
    (result, item) => {
      const key = `${item.debet_schet}_${item.debet_sub_schet}_${item.kredit_schet}`
      if (result[key]) {
        result[key].summa += item.summa
      } else {
        result[key] = { ...item }
      }
      return result
    },
    {} as Record<string, IProduct>
  )

  return Object.values(grouped).sort((a, b) => {
    if (a.debet_schet !== b.debet_schet) {
      return a.debet_schet.localeCompare(b.debet_schet)
    }
    if (a.debet_sub_schet !== b.debet_sub_schet) {
      return a.debet_sub_schet.localeCompare(b.debet_sub_schet)
    }
    if (a.kredit_schet !== b.kredit_schet) {
      return a.kredit_schet.localeCompare(b.kredit_schet)
    }
    return 0
  })
}

console.log(groupAndSumProvodka(mockProducts))
