import type { OstatokProduct } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { ChooseSpravochnik, DatePicker, GenericTable } from '@renderer/common/components'
import { CollapsibleTable } from '@renderer/common/components/collapsible-table'
import { Button } from '@renderer/common/components/ui/button'
import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/common/components/ui/dropdown-menu'
import { FormField } from '@renderer/common/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/common/components/ui/tabs'
import { useConfirm } from '@renderer/common/features/confirm'
import { DownloadFile, ImportFile } from '@renderer/common/features/file'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { date_iso_regex, formatDate, parseDate, validateDate } from '@renderer/common/lib/date'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { HttpResponseError } from '@renderer/common/lib/http'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleArrowDown, Download } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createPodrazdelenie7Spravochnik } from '../podrazdelenie/service'
import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokPodotchetColumns, ostatokProductColumns } from './columns'
import { defaultValues, ostatokQueryKeys } from './config'
import { ErrorAlert, type ErrorData, type ErrorDataDocument } from './error-alert'
import { getOstatokListQuery, ostatokService } from './service'
import { useOstatokStore } from './store'

enum TabOption {
  PRODUCTS = 'PRODUCTS',
  RESPONSIBLE = 'RESPONSIBLE'
}

const OstatokPage = () => {
  const { minDate, maxDate } = useOstatokStore()

  const [error, setError] = useState<ErrorData>()
  const [tabValue, setTabValue] = useState<TabOption>(TabOption.RESPONSIBLE)
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(minDate)

  const dropdownToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { search } = useSearch()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { main_schet_id, budjet_id } = useRequisitesStore()

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
      ostatokQueryKeys.getAll,
      {
        to: formatDate(selectedDate!),
        search,
        kimning_buynida: responsibleSpravochnik.selected?.id,
        responsible: tabValue === TabOption.RESPONSIBLE,
        budjet_id: budjet_id!,
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: getOstatokListQuery,
    enabled: !!selectedDate && !!budjet_id
  })

  const { mutate: deleteOstatok, isPending: isDeleting } = useMutation({
    mutationKey: [ostatokQueryKeys.delete],
    mutationFn: ostatokService.delete,
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.getAll]
      })
      toast.success(res?.message)
    },
    onError(error) {
      console.log(error)
      if (error instanceof HttpResponseError) {
        setError({
          message: error?.message ?? '',
          document: error.meta as ErrorDataDocument
        })
      }
      toast.error(error?.message)
    }
  })

  useEffect(() => {
    const date = form.getValues('date')
    if (date && minDate < date && date < maxDate) {
      return
    }
    form.setValue('date', minDate)
    setSelectedDate(minDate)
  }, [form, minDate, maxDate])
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

  const handleDelete = (row: OstatokProduct) => {
    confirm({
      onConfirm() {
        deleteOstatok(row.id)
      }
    })
  }

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
          <div>
            <ButtonGroup className="flex gap-5">
              {selectedDate ? (
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
                        fileName={`оборотка_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/obrotka/report"
                        params={{
                          to: formatDate(selectedDate),
                          main_schet_id,
                          excel: true
                        }}
                        buttonText="Оборотка"
                        className="w-full"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`материальная_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/material/report"
                        params={{
                          to: formatDate(selectedDate),
                          main_schet_id,
                          excel: true
                        }}
                        buttonText="Материальная"
                        className="w-full"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`шапка_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/cap/report"
                        params={{
                          to: formatDate(selectedDate),
                          budjet_id,
                          excel: true
                        }}
                        buttonText="Шапка"
                        className="w-full"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`шапка2_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/cap/back/report"
                        params={{
                          to: formatDate(selectedDate),
                          budjet_id,
                          excel: true
                        }}
                        buttonText="Шапка (2)"
                        className="w-full"
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

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
                onSuccess={() => {
                  queryClient.invalidateQueries({
                    queryKey: [ostatokQueryKeys.getAll]
                  })
                }}
              />
            </ButtonGroup>
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
                    validate={(date) => {
                      if (!validateDate(date)) {
                        if (date_iso_regex.test(date)) {
                          toast.error(t('date_does_not_exist'))
                        }
                        return false
                      }
                      const isValid = minDate <= parseDate(date) && parseDate(date) <= maxDate
                      if (!isValid && date?.length === 10) {
                        toast.error(
                          t('out_of_range', {
                            minDate: formatLocaleDate(formatDate(minDate)),
                            maxDate: formatLocaleDate(formatDate(maxDate))
                          })
                        )
                      }
                      return isValid
                    }}
                    calendarProps={{
                      fromMonth: minDate,
                      toMonth: maxDate
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
              loading={isFetching || isDeleting}
              className="overflow-x-hidden"
            >
              <CollapsibleTable
                data={ostatok?.data?.responsibles ?? []}
                columnDefs={ostatokPodotchetColumns}
                getRowId={(row) => row.id}
                getChildRows={(row) => row.products}
                renderChildRows={(rows) => (
                  <CollapsibleTable
                    data={rows}
                    columnDefs={ostatokProductColumns}
                    getRowId={(row) => row.id}
                    getChildRows={() => undefined}
                    onDelete={handleDelete}
                  />
                )}
              />
            </ListView.Content>
          </TabsContent>
          <TabsContent
            value={TabOption.PRODUCTS}
            className="data-[state=active]:flex-1 flex flex-col overflow-hidden"
          >
            <ListView.Content loading={isFetching || isDeleting}>
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

      {error?.document ? (
        <ErrorAlert
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setError(undefined)
            }
          }}
          error={error}
        />
      ) : null}
    </ListView>
  )
}

export default OstatokPage
