export interface AdminDashboardPodotchet {
  id: number
  name: string
  summa: number
  budjets: Array<{
    id: number
    name: string
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
      gazna_number?: string
      jur5_schet?: string
      jur7_schet?: string
      budjet_name: string
      jur3_schets_159: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      jur3_schets_152: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      jur4_schets: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      login: string
      fio: string
    }>
  }>
  podotchets: Array<{
    id: number
    name: string
    rayon: string
    user_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
    position: string
    rank: any
    summa: {
      prixod_sum: number
      rasxod_sum: number
      summa: number
    }
  }>
}

export interface AdminDashboardKassa {
  id: number
  name: string
  summa: number
  budjets: Array<{
    id: number
    name: string
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
      gazna_number?: string
      jur5_schet?: string
      jur7_schet?: string
      budjet_name: string
      jur3_schets_159: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      jur3_schets_152: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      jur4_schets: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      login: string
      fio: string
      kassa: {
        prixod_sum: number
        rasxod_sum: number
        summa: number
      }
    }>
  }>
}

export interface AdminDashboardBank {
  id: number
  name: string
  summa: number
  budjets: Array<{
    id: number
    name: string
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
      gazna_number?: string
      jur5_schet?: string
      jur7_schet?: string
      budjet_name: string
      jur3_schets_159: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      jur3_schets_152: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      jur4_schets: Array<{
        id: number
        schet: string
        main_schet_id: number
        type: string
        created_at: string
        updated_at: string
        isdeleted: boolean
      }>
      login: string
      fio: string
      bank: {
        prixod_sum: number
        rasxod_sum: number
        summa: number
      }
    }>
  }>
}
