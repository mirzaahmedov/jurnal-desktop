export interface WorkTrip {
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
  road: WorkTripRoad[]
  hotel: WorkTripHotel[]
  childs: WorkTripChild[]
}
interface WorkTripChild {
  schet_id: number
  summa: number
  type: string
}
interface WorkTripHotel {
  hostel_ticket_number: string
  day: number
  day_summa: number
  hostel_summa: number
}
interface WorkTripRoad {
  road_ticket_number: string
  from_region_id: number
  to_region_id: number
  km: number
  road_summa: number
}
