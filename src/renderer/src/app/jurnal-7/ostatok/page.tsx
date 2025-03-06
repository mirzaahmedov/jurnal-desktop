import type { OstatokProduct } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { createGroupSpravochnik } from '@renderer/app/super-admin/group/service'
import { ChooseSpravochnik, DatePicker } from '@renderer/common/components'
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
import { useConfirm } from '@renderer/common/features/confirm'
import { DownloadFile, ImportFile } from '@renderer/common/features/file'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { useElementWidth, usePagination, useToggle } from '@renderer/common/hooks'
import { useSidebarStore } from '@renderer/common/layout/sidebar'
import { date_iso_regex, formatDate, parseDate, validateDate } from '@renderer/common/lib/date'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { HttpResponseError } from '@renderer/common/lib/http'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleArrowDown, Download } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokGroupColumns, ostatokProductColumns } from './columns'
import { defaultValues, ostatokQueryKeys } from './config'
import { ErrorAlert, type ErrorData, type ErrorDataDocument } from './error-alert'
import { getOstatokListQuery, ostatokService } from './service'
import { useOstatokStore } from './store'
import { handleOstatokError } from './utils'

const OstatokPage = () => {
  const { minDate, maxDate } = useOstatokStore()

  const [error, setError] = useState<ErrorData>()
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(minDate)

  const dropdownToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const isCollapsed = useSidebarStore((store) => store.isCollapsed)

  const { search } = useSearch()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { width, setElementRef } = useElementWidth({
    trigger: isCollapsed
  })

  const form = useForm({
    defaultValues
  })

  const groupSpravochnik = useSpravochnik(createGroupSpravochnik({}))
  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  const {
    data: ostatok,
    isFetching,
    error: ostatokError
  } = useQuery({
    queryKey: [
      ostatokQueryKeys.getAll,
      {
        to: formatDate(selectedDate!),
        search,
        kimning_buynida: responsibleSpravochnik.selected?.id,
        group_id: groupSpravochnik.selected?.id,
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
    handleOstatokError(ostatokError)
  }, [ostatokError])
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
              spravochnik={groupSpravochnik}
              placeholder={t('choose', { what: t('group') })}
              getName={(selected) => `${selected.group_number} / ${selected.name}`}
              getElements={(selected) => [{ name: 'Наименование', value: selected.name }]}
            />

            <ChooseSpravochnik
              spravochnik={responsibleSpravochnik}
              placeholder={t('choose', { what: t('responsible') })}
              getName={(selected) => selected.fio}
              getElements={(selected) => [
                { name: t('fio'), value: selected.fio },
                { name: t('podrazdelenie'), value: selected.spravochnik_podrazdelenie_jur7_name }
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
      <div className="p-5 pt-0 w-full flex items-center justify-between gap-5">
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
          <Button
            variant="outline"
            type="submit"
          >
            <CircleArrowDown className="btn-icon icon-start" />
            {t('load')}
          </Button>
        </form>
      </div>
      <ListView.Content loading={isFetching || isDeleting}>
        <div ref={setElementRef}>
          <CollapsibleTable
            data={ostatok?.data ?? []}
            columnDefs={ostatokGroupColumns}
            getRowId={(row) => row.id}
            getChildRows={(row) => row.products}
            width={width}
            renderChildRows={(rows) => (
              <div
                style={{ width }}
                className="overflow-x-auto scrollbar pl-14"
              >
                <CollapsibleTable
                  data={rows}
                  columnDefs={ostatokProductColumns}
                  getRowId={(row) => row.naimenovanie_tovarov_jur7_id}
                  getChildRows={() => undefined}
                  onDelete={handleDelete}
                />
              </div>
            )}
          />
        </div>
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={ostatok?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>

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
