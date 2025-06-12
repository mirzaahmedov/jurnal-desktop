export interface WorkTrip {
  id: number
  user_id: number
  doc_num: string
  doc_date: string
  from_date: string
  to_date: string
  day_summa: number
  hostel_ticket_number: string
  hostel_summa: number
  from_district_id: number
  to_district_id: number
  road_ticket_number: string
  road_summa: number
  summa: number
  main_schet_id: number
  schet_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  worker_id: number
  comment: string
  worker_name: string
  worker_rayon: string
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
}
