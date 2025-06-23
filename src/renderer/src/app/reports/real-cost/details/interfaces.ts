import type { RealCostProvodka, RealCostShartnomaGrafik } from '@/common/models'

type RealCostMonthGrafik = Pick<
  RealCostShartnomaGrafik,
  | 'doc_num'
  | 'doc_date'
  | 'name'
  | 'rasxod_summa'
  | 'remaining_summa'
  | 'contract_grafik_summa'
  | 'organ_inn'
  | 'organ_name'
> & {
  grafik_id?: number
}
type RealCostYearGrafik = {
  [key in keyof RealCostMonthGrafik as `${key}_year`]: RealCostMonthGrafik[key]
}

export interface RealCostTableRow
  extends Pick<
      RealCostProvodka,
      'id' | 'smeta_name' | 'smeta_number' | 'month_summa' | 'year_summa' | 'smeta_id'
    >,
    RealCostMonthGrafik,
    RealCostYearGrafik {
  first: boolean
  size: number
}
