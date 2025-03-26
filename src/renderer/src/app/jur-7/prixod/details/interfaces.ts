export interface ExistingDocument {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string | null
  summa: string
  kimga_name: string
  spravochnik_organization_okonx: string
  spravochnik_organization_bank_klient: string
  spravochnik_organization_raschet_schet: string
  spravochnik_organization_raschet_schet_gazna: string
  spravochnik_organization_mfo: string
  spravochnik_organization_inn: string
  kimdan_name: string
  type: 'internal' | 'prixod' | 'rasxod'
}

export interface PrixodImportResult {
  name: string
  group_jur7_id: number
  inventar_num: string
  serial_num: string
  edin: string
  kol: number
  summa: number
  eski_iznos_summa: number
  nds_foiz: number
  iznos: boolean
  nds_summa: number
  summa_s_nds: number
  group: {
    id: number
    smeta_id: any
    name: string
    schet: string
    iznos_foiz: number
    provodka_debet: string
    group_number: string
    provodka_kredit: string
    provodka_subschet: string
    roman_numeral: any
    pod_group: string
    smeta_name: any
    smeta_number: any
  }
  sena: number
}
