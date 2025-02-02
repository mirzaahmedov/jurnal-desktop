import { createNaimenovanieSpravochnik } from '@renderer/app/jurnal-7/naimenovaniya/service'
import { createOstatokProductSpravochnik } from '@renderer/app/jurnal-7/ostatok'
import { UseSpravochnikReturn, useSpravochnik } from '@renderer/common/features/spravochnik'
import { OstatokProduct } from '@renderer/common/models'

type UseOstatokProductParams = {
  naimenovanie_tovarov_jur7_id: number
  kimdan_id: number
  doc_date: string
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
  onChange,
  kimdan_id,
  doc_date
}: UseOstatokProductParams): UseOstatokProductReturn => {
  const productOstatokSpravochnik = useSpravochnik(
    createOstatokProductSpravochnik({
      onChange(_, product) {
        onChange(product)
      },
      params: {
        responsible_id: kimdan_id,
        to: doc_date,
        product_id: naimenovanie_tovarov_jur7_id || undefined
      },
      includeParamsInGetById: true,
      enabled: !!kimdan_id
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
    group_jur7_number: product?.group_number ?? '',
    naimenovanie_tovarov_jur7_name: product?.name ?? '',
    spravochnik: productOstatokSpravochnik
  }
}
