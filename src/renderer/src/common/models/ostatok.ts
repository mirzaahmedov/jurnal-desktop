export type Ostatok = {
  id: number
  user_id: number
  naimenovanie_tovarov_jur7_id: number
  sena: number
  from: {
    kol: number
    summa: number
  }
  month: number
  year: number
  date_saldo: string
  kimning_buynida: number
  naimenovanie_tovarov: string
  edin: string
  group_name: string
  internal: {
    prixod: {
      kol: number
      summa: number
    }
    rasxod: {
      kol: number
      summa: number
    }
  }
  to: {
    kol: number
    summa: number
  }
}

export type OstatokProduct = {
  id: number
  user_id: number
  naimenovanie_tovarov_jur7_id: number
  sena: number
  from: {
    kol: number
    summa: number
  }
  month: number
  year: number
  date_saldo: string
  kimning_buynida: number
  naimenovanie_tovarov: string
  edin: string
  group_name: string
  to: {
    kol: number
    summa: number
  }
}
