export namespace Constant {
  export interface Region {
    id: number
    name: string
    created_at: string
    updated_at: string
    isdeleted: boolean
  }

  export interface District {
    id: number
    name: string
    region_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
  }
}
