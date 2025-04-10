export interface MainbookAutoFillSubChild {
  schet: string
  prixod: number
  rasxod: number
}
export interface MainbookAutoFill {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
  prixod: number
  rasxod: number
  sub_childs: Array<MainbookAutoFillSubChild>
}

export interface MainbookType {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  sort_order: number
}

export interface MainbookUniqueSchet {
  schet: string
  prixod: number
  rasxod: number
}
