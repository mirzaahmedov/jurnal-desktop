import type { Iznos } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { ChooseSpravochnik, DatePicker, GenericTable } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { FormField } from '@renderer/common/components/ui/form'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { date_iso_regex, formatDate, parseDate, validateDate } from '@renderer/common/lib/date'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'

import { OstatokViewOption, defaultValues, getOstatokListQuery } from '../ostatok'
import { handleOstatokError } from '../ostatok/utils'
import { createPodrazdelenie7Spravochnik } from '../podrazdelenie/service'
import { createResponsibleSpravochnik } from '../responsible/service'
import { columns } from './columns'
import { iznosQueryKeys } from './config'
import { EditIznosDialog } from './edit-dialog'

const IznosPage = () => {
  const navigate = useNavigate()
  const pagination = usePagination()
  const dialogToggle = useToggle()

  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { minDate, maxDate } = useOstatokStore()

  const [selected, setSelected] = useState<Iznos | null>(null)
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(minDate)

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

  const {
    data: iznosList,
    isFetching,
    error: iznosError
  } = useQuery({
    queryKey: [
      iznosQueryKeys.getAll,
      {
        to: formatDate(selectedDate!),
        search,
        kimning_buynida: responsibleSpravochnik.selected?.id,
        type: OstatokViewOption.PRODUCT,
        budjet_id: budjet_id!,
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: getOstatokListQuery,
    enabled: !!selectedDate
  })

  useEffect(() => {
    handleOstatokError(iznosError)
  }, [iznosError])
  useEffect(() => {
    setLayout({
      title: t('pages.iznos'),
      onCreate() {
        navigate('create')
      },
      content: SearchField,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ]
    })
  }, [setLayout])

  const handleEdit = (row: Iznos) => {
    setSelected(row)
    dialogToggle.open()
  }

  const onSubmit = form.handleSubmit((values) => {
    setSelectedDate(values.date)
  })

  return (
    <ListView>
      <ListView.Header>
        <div className="w-full flex items-center justify-between gap-5">
          <div className="flex items-center justify-between gap-5">
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
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={columns}
          data={(iznosList?.data?.products as unknown as Iznos[]) ?? []}
          onEdit={handleEdit}
        />
        <EditIznosDialog
          selected={selected}
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={iznosList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default IznosPage
