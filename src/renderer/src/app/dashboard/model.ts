export namespace Dashboard {
  export interface Budjet {
    id: number
    name: string
    created_at: string
    updated_at: string
    isdeleted: boolean
    main_schets: Array<{
      id: number
      spravochnik_budjet_name_id: number
      tashkilot_nomi: string
      tashkilot_bank: string
      tashkilot_mfo: string
      tashkilot_inn: string
      account_number: string
      account_name: string
      jur1_schet: string
      jur1_subschet: string
      jur2_schet: string
      jur2_subschet: string
      jur3_schet: string
      jur3_subschet: string
      jur4_schet: string
      jur4_subschet: string
      user_id: number
      created_at: string
      updated_at: string
      isdeleted: boolean
    }>
  }

  export interface Kassa {
    id: number
    name: string
    created_at: string
    updated_at: string
    isdeleted: boolean
    main_schets: Array<{
      id: number
      spravochnik_budjet_name_id: number
      tashkilot_nomi: string
      tashkilot_bank: string
      tashkilot_mfo: string
      tashkilot_inn: string
      account_number: string
      account_name: string
      jur1_schet: string
      jur1_subschet: string
      jur2_schet: string
      jur2_subschet: string
      jur3_schet: string
      jur3_subschet: string
      jur4_schet: string
      jur4_subschet: string
      user_id: number
      created_at: string
      updated_at: string
      isdeleted: boolean
      kassa: {
        summa: number
      }
    }>
  }

  export interface Bank {
    id: number
    name: string
    created_at: string
    updated_at: string
    isdeleted: boolean
    main_schets: Array<{
      id: number
      spravochnik_budjet_name_id: number
      tashkilot_nomi: string
      tashkilot_bank: string
      tashkilot_mfo: string
      tashkilot_inn: string
      account_number: string
      account_name: string
      jur1_schet: string
      jur1_subschet: string
      jur2_schet: string
      jur2_subschet: string
      jur3_schet: string
      jur3_subschet: string
      jur4_schet: string
      jur4_subschet: string
      user_id: number
      created_at: string
      updated_at: string
      isdeleted: boolean
      bank: {
        summa: number
      }
    }>
  }
}
