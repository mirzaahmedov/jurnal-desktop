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
  }
  export interface SpravochnikType {
    id: number
    name: string
    typeCode: number
    spravochnikZarplata: Array<any>
  }
}
