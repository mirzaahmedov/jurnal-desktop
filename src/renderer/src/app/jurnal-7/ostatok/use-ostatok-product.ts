import type { UseSpravochnikReturn } from '@renderer/common/features/spravochnik'
import type { OstatokProduct } from '@renderer/common/models'

import { createNaimenovanieSpravochnik } from '@renderer/app/jurnal-7/naimenovaniya/service'
import { OstatokViewOption, createOstatokProductSpravochnik } from '@renderer/app/jurnal-7/ostatok'
import { useSpravochnik } from '@renderer/common/features/spravochnik'

type UseOstatokProductParams = {
  naimenovanie_tovarov_jur7_id: number
  kimdan_id: number
  from: string
  doc_date: string
  disabledIds: number[]
  onChange: (product?: OstatokProduct) => void
}
export type UseOstatokProductReturn = {
  naimenovanie_tovarov_jur7_name: string
  edin: string
  group_jur7_number: string
  inventar_num: string
  serial_num: string
  spravochnik: UseSpravochnikReturn<OstatokProduct>
}

export const useOstatokProduct = ({
  naimenovanie_tovarov_jur7_id,
  kimdan_id,
  from,
  doc_date,
  disabledIds,
  onChange
}: UseOstatokProductParams): UseOstatokProductReturn => {
  const productOstatokSpravochnik = useSpravochnik(
    createOstatokProductSpravochnik({
      onChange(_, ostatok) {
        onChange(ostatok as any)
      },
      params: {
        kimning_buynida: kimdan_id,
        from,
        to: doc_date,
        type: OstatokViewOption.RESPONSIBLE,
        product_id: naimenovanie_tovarov_jur7_id || undefined
      },
      includeParamsInGetById: true,
      enabled: !!kimdan_id,
      disabledIds
    })
  )
  const naimenovanieSpravochnik = useSpravochnik(
    createNaimenovanieSpravochnik({
      value: naimenovanie_tovarov_jur7_id
    })
  )

  const product = naimenovanieSpravochnik.selected

  return {
    edin: product?.edin ?? '',
    serial_num: product?.serial_num ?? '',
    inventar_num: product?.inventar_num ?? '',
    group_jur7_number: (product?.group_number || product?.group_name) ?? '',
    naimenovanie_tovarov_jur7_name: product?.name ?? '',
    spravochnik: productOstatokSpravochnik as any
  }
}
