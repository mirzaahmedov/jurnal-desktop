export interface UderjanieNachislenieProvodka {
  foiz: string
  name: string
  summa: string
  type_code: string
}
export interface UderjanieProvodka {
  name: string
  summa: string
  razmer: string
  vid_uder: string
  type_code: string
  types_type_code: string
  nimaning_uderjaniyasi: string
}
export interface UderjanieDopOplataProvodka {
  name: string
  summa: string
  razmer: string
  elements: string
  vid_uder: any
  type_code: any
  types_name: any
  types_type_code: any
}

export interface Uderjanie {
  nachislenieId: number
  mainZarplataId: number
  kartochka: string
  fio: string
  rayon: string
  vacantId: number
  doljnostName: string
  rootObjectNachislenie: {
    rows: UderjanieNachislenieProvodka[]
  }
  rootObjectUderjanie: {
    rows: UderjanieProvodka[]
  }
  rootDopOplata: {
    rows: UderjanieDopOplataProvodka[]
  }
  nachislenieSumma: number
  uderjanieSumma: number
  dopOplataSumma: number
  naRuki: number
}

export interface UderjanieAlimentProvodka {
  spravochnikOperatsiiId: number
  summa: number
}
export interface UderjanieAliment {
  idSpravochnikOrganization: number
  summa: number
  opisanie: string
  organizationByRaschetSchetId: number
  organizationByRaschetSchetGaznaId: number
  childs: UderjanieAlimentProvodka[]
}
