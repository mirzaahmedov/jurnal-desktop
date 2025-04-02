export enum PrixodbookStatus {
  SEND = 1,
  REJECT = 2,
  ACCEPT = 3
}

export interface Prixodbook {
  id: number
  status: number
  accept_time: null | string
  send_time: PrixodbookStatus
  user_id: number
  fio: string
  login: string
  year: number
  month: number
  budjet_id: number
  budjet_name: string
  accept_user_id: null | number
  accept_user_fio: null | string
  accept_user_login: null | string
  childs: PrixodbookChild[]
}

export interface PrixodbookChild {
  type_id: number
  type_name: string
  prixod: number
  rasxod: number
  sub_childs: Array<{
    id: number
    schet: string
    prixod: number
    rasxod: number
  }>
}

export interface AdminPrixodbook {
  id: number
  status: number
  accept_time: string
  send_time: string
  user_id: number
  fio: string
  login: string
  year: number
  month: number
  budjet_id: number
  budjet_name: string
  accept_user_id: number
  accept_user_fio: string
  accept_user_login: string
  region_name: string
  childs: PrixodbookChild[]
}
