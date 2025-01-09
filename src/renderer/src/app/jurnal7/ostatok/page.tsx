import { GenericTable, SpravochnikInput } from '@renderer/common/components'

import { ListView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { createPodrazdelenie7Spravochnik } from '../podrazdelenie/service'
import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokColumns } from './columns'
import { ostatokQueryKeys } from './config'
import { ostatokService } from './service'
import { useQuery } from '@tanstack/react-query'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { useState } from 'react'

const OstatokPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const podrazdelenieSpravochnik = useSpravochnik(
    createPodrazdelenie7Spravochnik({
      onChange: () => {
        responsibleSpravochnik.clear()
      }
    })
  )
  const responsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      params: {
        podraz_id: podrazdelenieSpravochnik.selected?.id
      },
      enabled: !!podrazdelenieSpravochnik.selected
    })
  )

  const { data: ostatokList, isFetching } = useQuery({
    queryKey: [
      ostatokQueryKeys.getAll,
      {
        year,
        month,
        kimning_buynida: responsibleSpravochnik.selected?.id
      }
    ],
    queryFn: ostatokService.getAll,
    enabled: !!responsibleSpravochnik.selected?.id
  })

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <div className="flex gap-10 justify-between p-5">
          <div className="flex gap-5">
            <SpravochnikInput
              value={podrazdelenieSpravochnik.selected?.name ?? 'Выберите подразделение'}
              onDoubleClick={podrazdelenieSpravochnik.open}
              onClear={podrazdelenieSpravochnik.clear}
              className="min-w-[300px]"
            />
            <SpravochnikInput
              value={responsibleSpravochnik.selected?.fio ?? 'Выберите ответственное лицо'}
              onDoubleClick={responsibleSpravochnik.open}
              onClear={responsibleSpravochnik.clear}
              disabled={!podrazdelenieSpravochnik.selected}
              className="min-w-[300px]"
            />
          </div>
          <MonthPicker
            value={`${year}-${month}-01`}
            onChange={(date) => {
              const [year, month] = date.split('-').map(Number)
              setYear(year)
              setMonth(month)
            }}
          />
        </div>
        <GenericTable
          columns={ostatokColumns}
          data={ostatokList?.data ?? []}
        />
      </ListView.Content>
    </ListView>
  )
}

export default OstatokPage
