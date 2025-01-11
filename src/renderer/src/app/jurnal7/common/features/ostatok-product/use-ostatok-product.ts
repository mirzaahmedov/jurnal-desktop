import { useEffect, useState } from 'react'

import { InternalTransferChildFormType } from '@renderer/app/jurnal7/internal-transfer/config'
import { Naimenovanie } from '@renderer/common/models'
import { RasxodChildFormType } from '@renderer/app/jurnal7/rasxod/config'
import { createGroupSpravochnik } from '@renderer/app/super-admin/group/service'
import { createOstatokProductSpravochnik } from '@renderer/app/jurnal7/ostatok'
import { useSpravochnik } from '@renderer/common/features/spravochnik'

type UseOstatokProductParams = {
  index: number
  value: number
  kimdan_id: number
  doc_date: string
  setMaxKol: (value: number) => void
  onChange: (value: number) => void
  onChangeChildFieldEvent: (
    index: number,
    key: keyof (RasxodChildFormType | InternalTransferChildFormType),
    value: unknown
  ) => void
}
export const useOstatokProduct = ({
  index,
  value,
  onChange,
  setMaxKol,
  kimdan_id,
  doc_date,
  onChangeChildFieldEvent
}: UseOstatokProductParams) => {
  const [values, setValues] = useState<Pick<Naimenovanie, 'group_jur7_id' | 'name' | 'edin'>>({
    group_jur7_id: 0,
    name: '',
    edin: ''
  })

  const productOstatokSpravochnik = useSpravochnik(
    createOstatokProductSpravochnik({
      value,
      onChange(id, data) {
        onChange(id)

        if (!data?.to.kol) {
          return
        }
        setMaxKol(data?.to.kol ?? Infinity)
        onChangeChildFieldEvent(index, 'kol', data?.to.kol ?? 0)
        onChangeChildFieldEvent(index, 'sena', data?.sena ?? 0)
        onChangeChildFieldEvent(
          index,
          'data_pereotsenka',
          data?.prixod_doc_date ? data.prixod_doc_date.substring(0, 10) : ''
        )
      },
      params: {
        kimning_buynida: kimdan_id,
        to: doc_date
      },
      includeParamsInGetById: true,
      enabled: !!kimdan_id
    })
  )
  const groupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: values.group_jur7_id,
      onChange: (id) => {
        setValues((prev) => ({ ...prev, group_jur7_id: id }))
      }
    })
  )

  useEffect(() => {
    const selected = productOstatokSpravochnik.selected as unknown as [
      typeof productOstatokSpravochnik.selected
    ]

    if (!selected || !selected.length || !selected[0]?.to?.kol) {
      setValues({
        group_jur7_id: 0,
        name: '',
        edin: ''
      })
      return
    }

    setValues({
      group_jur7_id: selected[0]?.group_jur7_id ?? 0,
      name: selected[0]?.naimenovanie_tovarov ?? '',
      edin: selected[0]?.edin ?? ''
    })
  }, [productOstatokSpravochnik.selected, onChangeChildFieldEvent, index, setMaxKol])

  return {
    values,
    groupSpravochnik,
    productOstatokSpravochnik
  }
}
