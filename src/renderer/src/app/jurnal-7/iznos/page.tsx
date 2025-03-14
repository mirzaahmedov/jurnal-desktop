import type { OstatokProduct } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { createGroupSpravochnik } from '@renderer/app/super-admin/group/service'
import { ChooseSpravochnik, DatePicker, GenericTable } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { FormField } from '@renderer/common/components/ui/form'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { formatDate, parseDate } from '@renderer/common/lib/date'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'

import { defaultValues, ostatokProductService } from '../ostatok'
import { handleOstatokError, validateOstatokDate } from '../ostatok/utils'
import { createResponsibleSpravochnik } from '../responsible/service'
import { iznosColumns } from './columns'
import { iznosQueryKeys } from './config'
import { EditIznosDialog } from './edit-dialog'

const IznosPage = () => {
  const navigate = useNavigate()
  const dialogToggle = useToggle()

  const pagination = usePagination()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { minDate, maxDate } = useOstatokStore()

  const [selected] = useState<OstatokProduct | null>(null)
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(minDate)

  const form = useForm({
    defaultValues
  })

  const groupSpravochnik = useSpravochnik(createGroupSpravochnik({}))
  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  const {
    data: iznos,
    isFetching,
    error: iznosError
  } = useQuery({
    queryKey: [
      iznosQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        to: formatDate(selectedDate!),
        search,
        kimning_buynida: responsibleSpravochnik.selected?.id,
        group_id: groupSpravochnik.selected?.id,
        budjet_id: budjet_id!,
        iznos: true
      }
    ],
    queryFn: ostatokProductService.getAll,
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

  // const handleEdit = (row: OstatokProduct) => {
  //   setSelected(row)
  //   dialogToggle.open()
  // }

  const onSubmit = form.handleSubmit((values) => {
    setSelectedDate(values.date)
  })

  return (
    <ListView>
      <ListView.Header>
        <div className="w-full flex items-center justify-between gap-5">
          <div className="flex items-center justify-between gap-5">
            <ChooseSpravochnik
              spravochnik={groupSpravochnik}
              placeholder={t('choose', { what: t('group').toLowerCase() })}
              getName={(selected) => `${selected.group_number ?? ''} / ${selected.name}`}
              getElements={(selected) => [{ name: 'Наименование', value: selected.name }]}
            />

            <ChooseSpravochnik
              spravochnik={responsibleSpravochnik}
              placeholder={t('choose', { what: t('responsible').toLowerCase() })}
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
                  validate={validateOstatokDate}
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
          columnDefs={iznosColumns}
          data={iznos?.data ?? []}
          getRowId={(row) => row.product_id}
        />

        <EditIznosDialog
          selected={selected}
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={iznos?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default IznosPage
