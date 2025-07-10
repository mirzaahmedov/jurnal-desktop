export interface DopOplata {
  id: number
  docNum: string
  docDate: string
  mainZarplataId: number
  spravochnikZarplataId: number
  typesSpravochnikZarplataId: number
  vidUder: string
  elements: string
  razmer: number
  summa: number
  srok: string
  stop: boolean
  typesTypeCode: number
  typesName: string
  typeName: string
  typeCode: number
  childs: DopOplataChild[]
}

export interface DopOplataChild {
  id: number
  name: string
  period: number
  summa: number
}
