import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { defaultValues, ostatokProductColumns } from '@/app/jur-7/ostatok'
import { createPodrazdelenie7Spravochnik } from '@/app/jur-7/podrazdelenie/service'
import { createResponsibleSpravochnik } from '@/app/jur-7/responsible/service'
import { ChooseSpravochnik, DatePicker, GenericTable } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { Button } from '@/common/components/ui/button'
import { FormField } from '@/common/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useSpravochnik } from '@/common/features/spravochnik'
import { usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatDate, parseDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { getAdminOstatokListQuery } from './service'

enum TabOption {
  PRODUCTS = 'PRODUCTS',
  RESPONSIBLE = 'RESPONSIBLE'
}

const AdminOstatokPage = () => {
  const [tabValue, setTabValue] = useState<TabOption>(TabOption.RESPONSIBLE)
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(defaultValues.date)

  const pagination = usePagination()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

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

  const { data: ostatok, isFetching } = useQuery({
    queryKey: [
      '/admin/ostatok',
      {
        to: formatDate(selectedDate!),
        search,
        kimning_buynida: responsibleSpravochnik.selected?.id,
        responsible: tabValue === TabOption.RESPONSIBLE,
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: getAdminOstatokListQuery,
    enabled: !!selectedDate
  })

  useEffect(() => {
    setLayout({
      title: t('pages.ostatok'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ]
    })
  }, [setLayout, t])

  const onSubmit = form.handleSubmit((values) => {
    setSelectedDate(values.date)
  })

  return (
    <ListView>
      <ListView.Header className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-5">
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
        </div>
      </ListView.Header>
      <Tabs
        value={tabValue}
        onValueChange={(value) => setTabValue(value as TabOption)}
        asChild
      >
        <>
          <div className="p-5 pt-0 w-full flex items-center justify-between gap-5">
            <TabsList>
              <TabsTrigger value={TabOption.RESPONSIBLE}>{t('responsible')}</TabsTrigger>
              <TabsTrigger value={TabOption.PRODUCTS}>{t('products')}</TabsTrigger>
            </TabsList>

            <form
              onSubmit={onSubmit}
              className="flex items-center justify-start gap-5"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? formatDate(field.value) : ''}
                    onChange={(value) => {
                      field.onChange(value ? parseDate(value) : undefined)
                    }}
                  />
                )}
              />
              <Button type="submit">
                <CircleArrowDown className="btn-icon icon-start" />
                {t('load')}
              </Button>
            </form>
          </div>
          <TabsContent
            value={TabOption.RESPONSIBLE}
            className="data-[state=active]:flex-1 flex flex-col overflow-hidden"
          >
            <ListView.Content
              loading={isFetching}
              className="overflow-x-hidden"
            >
              <CollapsibleTable
                data={ostatok?.data?.responsibles ?? []}
                columnDefs={[]}
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
          </TabsContent>
          <TabsContent
            value={TabOption.PRODUCTS}
            className="data-[state=active]:flex-1 flex flex-col overflow-hidden"
          >
            <ListView.Content loading={isFetching}>
              <GenericTable
                data={ostatok?.data?.products ?? []}
                columnDefs={ostatokProductColumns}
                getRowId={(row) => row.id}
              />
            </ListView.Content>
            <ListView.Footer>
              <ListView.Pagination
                pageCount={ostatok?.meta?.pageCount ?? 0}
                {...pagination}
              />
            </ListView.Footer>
          </TabsContent>
        </>
      </Tabs>
    </ListView>
  )
}

export default AdminOstatokPage
