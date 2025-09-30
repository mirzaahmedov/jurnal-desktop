export namespace Zarplata {
  export interface Spravochnik {
    id: number
    typeCode: number
    name: string
    typesTypeCode: number
    typeName: string
    spravochnikOperatsiiId: number
    spravochnikOperatsiiName: string
    foiz: any
    sena1: any
    sena2: any
    schet: any
    subSchet: any
    isPoek: boolean
  }
  export interface SpravochnikType {
    id: number
    name: string
    typeCode: number
    spravochnikZarplata: Array<any>
  }
}

export interface AdminZarplataDashboard {
  regionId: number
  regionName: string
  uderjanieSum: number
  mainSchet: AdminZarplataMainSchet[]
}
export interface AdminZarplataMainSchet {
  mainSchetId: number
  spravochnikBudjetNameId: number
  budjetName: string
  accountNumber: string
  schet: string
  uderjanieSumma: number
}

export interface IAliment {
  mainZarplataId: number
  fio: string
  deductionId: number
  deductionName: string
  poluchatelFio: string
  cardNumber: string
  summa: number
  percentage: number
  type: string
  docDate: string
  docNum: number
}
