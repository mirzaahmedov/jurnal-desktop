export interface Uderjanie {
  nachislenieId: number
  mainZarplataId: number
  kartochka: string
  fio: string
  rayon: string
  vacantId: number
  doljnostName: string
  rootObjectNachislenie: {
    rows: Array<{
      foiz: string
      name: string
      summa: string
      type_code: string
    }>
  }
  rootObjectUderjanie: {
    rows: Array<{
      name: string
      summa: string
      razmer: string
      vid_uder: string
      type_code: string
      types_type_code: string
      nimaning_uderjaniyasi: string
    }>
  }
  rootDopOplata: {
    rows: Array<any>
  }
  nachislenieSumma: number
  uderjanieSumma: number
  dopOplataSumma: number
  naRuki: number
}
