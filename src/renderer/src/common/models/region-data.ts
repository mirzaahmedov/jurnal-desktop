type RegionData = {
  id: number
  name: string
  counts: {
    kassa_count: number
    bank_count: number
    organ_count: number
    jur7_count: number
    storage_count: number
    total_count: number
  }
}

export type { RegionData }
