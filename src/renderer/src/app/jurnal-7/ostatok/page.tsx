import { ChooseSpravochnik, GenericTable } from '@renderer/common/components'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@renderer/common/lib/date'
import { ostatokColumns, ostatokHeaderGroups } from './columns'

import { MonthPicker } from '@renderer/common/components/month-picker'
import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { DownloadFile } from '@renderer/common/features/file'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { createPodrazdelenie7Spravochnik } from '../podrazdelenie/service'
import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokQueryKeys } from './config'
import { ostatokService } from './service'

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
        to: formatDate(new Date(year, month, 1)),
        responsible_id: responsibleSpravochnik.selected?.id
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
            <ChooseSpravochnik
              spravochnik={podrazdelenieSpravochnik}
              placeholder="Выберите подразделение"
              getName={(selected) => selected.name}
              getElements={(selected) => [{ name: 'Наименование', value: selected.name }]}
            />

            <ChooseSpravochnik
              disabled={!podrazdelenieSpravochnik.selected}
              spravochnik={responsibleSpravochnik}
              placeholder="Выберите ответственное лицо"
              getName={(selected) => selected.fio}
              getElements={(selected) => [
                { name: 'ФИО', value: selected.fio },
                { name: 'Подразделение', value: selected.spravochnik_podrazdelenie_jur7_name }
              ]}
            />
          </div>
          <div>
            <ButtonGroup borderStyle="dashed">
              <DownloadFile
                fileName={`оборотка_${year}-${month}.xlsx`}
                url="/jur_7/monitoring/obrotka/report"
                params={{
                  year,
                  month,
                  main_schet_id
                }}
                buttonText="Оборотка"
              />
              <DownloadFile
                fileName={`материальная_${year}-${month}.xlsx`}
                url="/jur_7/monitoring/material/report"
                params={{
                  year,
                  month,
                  main_schet_id
                }}
                buttonText="Материальная"
              />
              <DownloadFile
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
              <DownloadFile
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
          columnDefs={ostatokColumns}
          headerGroups={ostatokHeaderGroups}
          data={ostatokList?.data ?? []}
        />
      </ListView.Content>
    </ListView>
  )
}

export default OstatokPage
