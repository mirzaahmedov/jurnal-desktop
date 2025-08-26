import type { Operatsii } from './operatsii'

export interface WorkTrip {
  id: number
  minimum_wage_id: number
  doc_num: string
  doc_date: string
  from_date: string
  to_date: string
  day_summa: number
  hostel_summa: number
  road_summa: number
  summa: number
  comment: string
  worker_id: number
  worker_name: string
  worker_rayon: string
  road: WorkTripRoad[]
  hotel: WorkTripHotel[]
  childs: WorkTripChild[]
}
export interface WorkTripChild {
  id: number
  schet_id: number
  schet: Operatsii
  summa: number
  type: string
}
export interface WorkTripHotel {
  id: number
  hostel_ticket_number: string
  day: number
  day_summa: number
  hostel_summa: number
}
export interface WorkTripRoad {
  id: number
  road_ticket_number: string
  from?: string
  from_region_id: number
  to?: string
  to_region_id: number
  km: number
  road_summa: number
}
