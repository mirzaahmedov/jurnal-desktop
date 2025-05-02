export namespace Dashboard {
  export interface Budjet {
    id: number
    name: string
    created_at: string
    updated_at: string
    isdeleted: boolean
    main_schets: Array<{
      main_schet: {
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
        gazna_number: string
        jur5_schet: string
        jur7_schet: string
      }
      id: number
      user_id: number
      jur4_schets: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
    }>
  }

  export interface Kassa {
    id: number
    name: string
    created_at: string
    updated_at: string
    isdeleted: boolean
    main_schets: Array<{
      main_schet: {
        id: number
        spravochnik_budjet_name_id: number
        tashkilot_nomi: string
        tashkilot_bank: string
        tashkilot_mfo: string
        tashkilot_inn: string
        account_number: string
        account_name: string
        jur1_schet: string
        jur1_subschet?: string
        jur2_schet: string
        jur2_subschet?: string
        jur3_schet?: string
        jur3_subschet?: string
        jur4_schet?: string
        jur4_subschet?: string
        user_id: number
        created_at: string
        updated_at: string
        isdeleted: boolean
        gazna_number: string
        jur5_schet?: string
        jur7_schet?: string
      }
      id: number
      user_id: number
      jur4_schets: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      kassa: {
        prixod_sum?: number
        rasxod_sum?: number
        summa: number
      }
      saldo?: {
        id: number
        main_schet_id: number
        summa: number
        month: number
        year: number
        user_id: number
        created_at: string
        updated_at: string
        isdeleted: boolean
        budjet_id: number
        date_saldo: string
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
      main_schet: {
        id: number
        spravochnik_budjet_name_id: number
        tashkilot_nomi: string
        tashkilot_bank: string
        tashkilot_mfo: string
        tashkilot_inn: string
        account_number: string
        account_name: string
        jur1_schet: string
        jur1_subschet?: string
        jur2_schet: string
        jur2_subschet?: string
        jur3_schet?: string
        jur3_subschet?: string
        jur4_schet?: string
        jur4_subschet?: string
        user_id: number
        created_at: string
        updated_at: string
        isdeleted: boolean
        gazna_number: string
        jur5_schet?: string
        jur7_schet?: string
      }
      id: number
      user_id: number
      jur4_schets: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      bank: {
        summa: number
      }
      saldo: any
    }>
  }

  export interface Podotchet {
    id: number
    name: string
    rayon: string
    budjets: Array<{
      id: number
      name: string
      created_at: string
      updated_at: string
      isdeleted: boolean
      main_schets: Array<{
        main_schet: {
          id: number
          spravochnik_budjet_name_id: number
          tashkilot_nomi: string
          tashkilot_bank: string
          tashkilot_mfo: string
          tashkilot_inn: string
          account_number: string
          account_name: string
          jur1_schet: string
          jur1_subschet?: string
          jur2_schet: string
          jur2_subschet?: string
          jur3_schet?: string
          jur3_subschet?: string
          jur4_schet?: string
          jur4_subschet?: string
          user_id: number
          created_at: string
          updated_at: string
          isdeleted: boolean
          gazna_number: string
          jur5_schet?: string
          jur7_schet?: string
        }
        id: number
        user_id: number
        jur4_schets: Array<{
          id: number
          schet: string
          main_schet_id: number
          type: string
          created_at: string
          updated_at: string
          isdeleted: boolean
          podotchet: {
            summa: number
          }
        }>
      }>
    }>
  }
}
