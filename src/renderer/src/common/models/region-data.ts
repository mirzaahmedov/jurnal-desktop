export interface RegionData {
  id: number
  name: string
  counts: TableCounts
}
export interface TableCounts {
  order_1: number
  order_2: number
  order_3: number
  order_4: number
  order_5: number
  order_7: number
  storage: number
  all: number
}
