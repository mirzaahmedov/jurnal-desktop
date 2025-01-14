import { DownloadDocumentButton, GenericTable, SpravochnikInput } from '@renderer/common/components'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@renderer/common/lib/date'

import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { ListView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { createPodrazdelenie7Spravochnik } from '../podrazdelenie/service'
import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokColumns } from './columns'
import { ostatokQueryKeys } from './config'
import { ostatokService } from './service'
import { useLayout } from '@renderer/common/features/layout'
import { useQuery } from '@tanstack/react-query'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { useState } from 'react'

const OstatokPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const { main_schet_id, budjet_id } = useRequisitesStore()

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

  useLayout({
    title: 'Остаток'
  })

  const date = new Date(`${year}-${month}-01`)
  const from = formatDate(getFirstDayOfMonth(date))
  const to = formatDate(getLastDayOfMonth(date))

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <div className="flex gap-10 justify-between p-5">
          <div className="flex gap-5">
            <SpravochnikInput
              readOnly
              value={podrazdelenieSpravochnik.selected?.name ?? 'Выберите подразделение'}
              onDoubleClick={podrazdelenieSpravochnik.open}
              onClear={podrazdelenieSpravochnik.clear}
              className="min-w-[300px]"
            />
            <SpravochnikInput
              readOnly
              value={responsibleSpravochnik.selected?.fio ?? 'Выберите ответственное лицо'}
              onDoubleClick={responsibleSpravochnik.open}
              onClear={responsibleSpravochnik.clear}
              disabled={!podrazdelenieSpravochnik.selected}
              className="min-w-[300px]"
            />
          </div>
          <div>
            <ButtonGroup>
              <DownloadDocumentButton
                fileName={`оборотка_${year}-${month}.xlsx`}
                url="/jur_7/monitoring/obrotka/report"
                params={{
                  year,
                  month,
                  main_schet_id
                }}
                buttonText="Оборотка"
              />
              <DownloadDocumentButton
                fileName={`материальная_${year}-${month}.xlsx`}
                url="/jur_7/monitoring/material/report"
                params={{
                  year,
                  month,
                  main_schet_id
                }}
                buttonText="Материальная"
              />
              <DownloadDocumentButton
                fileName={`шапка_${year}-${month}.xlsx`}
                url="/jur_7/monitoring/cap/report"
                params={{
                  from,
                  to,
                  budjet_id,
                  excel: true
                }}
                buttonText="Шапка"
              />
              <DownloadDocumentButton
                fileName={`шапка2_${year}-${month}.xlsx`}
                url="/jur_7/monitoring/cap/back/report"
                params={{
                  from,
                  to,
                  budjet_id,
                  excel: true
                }}
                buttonText="Шапка (2)"
              />
            </ButtonGroup>
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
