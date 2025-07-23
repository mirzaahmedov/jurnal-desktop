export interface Tabel {
  id: number
  spravochnikBudjetNameId: number
  mainSchetId: number
  tabelYear: number
  tabelMonth: number
  docNum: number
  docDate: string
  children: TabelProvodka[]
  tabelChildren: TabelProvodka[]
}
export interface TabelProvodka {
  id: number
  vacantId: number
  mainZarplataId: number
  mainZarplataName: string
  dojlnostName: string
  rabDni: number
  otrabDni: number
  noch: number
  prazdnik: number
  pererabodka: number
  kazarma: number
}
