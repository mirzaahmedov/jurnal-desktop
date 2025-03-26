import type { Group } from './group'
import type { Naimenovanie } from './naimenovanie'
import type { Responsible } from './responsible'

export interface InternalChild {
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
  product: Naimenovanie
  group: Group
}
export interface Internal {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_id: number
  kimdan_name: string
  kimga_name: string
  kimga_id: number
  kimdan: Responsible
  kimga: Responsible
  childs: InternalChild[]
}
