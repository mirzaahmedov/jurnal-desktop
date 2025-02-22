import { useEffect } from 'react'

import { ChooseSpravochnik } from '@renderer/common/components'
import { CollapsibleTable } from '@renderer/common/components/collapsible-table'
import { Button } from '@renderer/common/components/ui/button'
import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/common/components/ui/dropdown-menu'
import { DownloadFile, ImportFile } from '@renderer/common/features/file'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { useDates, useToggle } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { createPodrazdelenie7Spravochnik } from '../podrazdelenie/service'
import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokPodotchetColumns, ostatokProductColumns } from './columns'
import { ostatokQueryKeys } from './config'
import { ostatokService } from './service'

const OstatokPage = () => {
  const dropdownToggle = useToggle()
  const dates = useDates()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { search } = useSearch()
  const { t } = useTranslation(['app'])
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
        ...dates,
        search,
        kimning_buynida: responsibleSpravochnik.selected?.id
      }
    ],
    queryFn: ostatokService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.ostatok'),
      content: SearchField,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header>
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
            <ButtonGroup className="flex gap-5">
              <DropdownMenu open={dropdownToggle.isOpen}>
                <DropdownMenuTrigger
                  asChild
                  onClick={dropdownToggle.open}
                >
                  <Button variant="ghost">
                    <Download className="btn-icon icon-start" />
                    <span className="titlecase">
                      {t('download-something', { something: t('reports') })}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  onInteractOutside={dropdownToggle.close}
                >
                  <DropdownMenuItem>
                    <DownloadFile
                      fileName={`оборотка_${dates.from}-${dates.to}.xlsx`}
                      url="/jur_7/monitoring/obrotka/report"
                      params={{
                        from: dates.from,
                        to: dates.to,
                        main_schet_id,
                        excel: true
                      }}
                      buttonText="Оборотка"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <DownloadFile
                      fileName={`материальная_${dates.from}-${dates.to}.xlsx`}
                      url="/jur_7/monitoring/material/report"
                      params={{
                        from: dates.from,
                        to: dates.to,
                        main_schet_id,
                        excel: true
                      }}
                      buttonText="Материальная"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <DownloadFile
                      fileName={`шапка_${dates.from}-${dates.to}.xlsx`}
                      url="/jur_7/monitoring/cap/report"
                      params={{
                        from: dates.from,
                        to: dates.to,
                        budjet_id,
                        excel: true
                      }}
                      buttonText="Шапка"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <DownloadFile
                      fileName={`шапка2_${dates.from}-${dates.to}.xlsx`}
                      url="/jur_7/monitoring/cap/back/report"
                      params={{
                        from: dates.from,
                        to: dates.to,
                        budjet_id,
                        excel: true
                      }}
                      buttonText="Шапка (2)"
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DownloadFile
                fileName={`${t('pages.ostatok')}-${t('import')}-${t('template')}.xlsx`}
                url="/jur_7/saldo/temlate"
                buttonText={t('download-something', { something: t('template') })}
                params={{
                  excel: true
                }}
              />
              <ImportFile
                url="/jur_7/saldo/import"
                params={{
                  main_schet_id,
                  budjet_id
                }}
              />
            </ButtonGroup>
          </div>
        </div>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <CollapsibleTable
          data={ostatokList?.data ?? []}
          columnDefs={ostatokPodotchetColumns}
          getRowId={(row) => row.id}
          getChildRows={(row) => row.products}
          renderChildRows={(rows) => (
            <CollapsibleTable
              data={rows}
              columnDefs={ostatokProductColumns}
              getRowId={(row) => row.id}
              getChildRows={() => undefined}
            />
          )}
        />
      </ListView.Content>
    </ListView>
  )
}

export default OstatokPage
