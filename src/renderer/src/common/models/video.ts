export interface VideoModule {
  id: number
  name: string
  status: boolean
}

export interface Video {
  id: number
  module_id: number
  name: string
  file: string
  created_at: string
  updated_at: string
  isdeleted: boolean
  status: boolean
  sort_order: number
}
