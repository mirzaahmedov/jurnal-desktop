type InternalTransferChild = {
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
}
type InternalTransfer = {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: InternalTransferChild[]
}

export type { InternalTransferChild, InternalTransfer }
