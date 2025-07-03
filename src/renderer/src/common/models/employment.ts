export interface Employment {
  id: number
  mainZarplataId: number
  vacantId: number | null
  rayon: string
  doljnostName: string
  spravochnikZarplataDoljnostId: number | null
  spName: string | null
  prikazStart: string
  dateStart: string
  stavka: number | null
  prikazFinish: string | null
  dateFinish: string | null
  summa: number
}
