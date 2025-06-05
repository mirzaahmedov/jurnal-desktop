import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import {
  ChooseSpravochnik,
  DatePicker,
  FooterCell,
  FooterRow,
  GenericTable
} from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { FormField } from '@/common/components/ui/form'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSpravochnik } from '@/common/features/spravochnik'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate, parseDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { createResponsibleSpravochnik } from '../responsible/service'
import { MaterialSaldoProductService, defaultValues } from '../saldo'
import { useWarehouseSaldo } from '../saldo/use-saldo'
import { handleOstatokError } from '../saldo/utils'
import { IznosColumns } from './columns'
import { IznosQueryKeys } from './config'

const IznosPage = () => {
  const pagination = usePagination()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { startDate, endDate } = useSelectedMonthStore()
  const { queuedMonths } = useWarehouseSaldo()

  const [search] = useSearchFilter()
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(startDate)

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
      IznosQueryKeys.getAll,
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
    queryFn: MaterialSaldoProductService.getAll,
    enabled: !!selectedDate && !!budjet_id && queuedMonths.length === 0,
    select: (data) =>
      !!selectedDate && !!budjet_id && queuedMonths.length === 0 ? data : undefined
  })

  useEffect(() => {
    if (iznosError) {
      handleOstatokError(iznosError)
    }
  }, [iznosError])
  useEffect(() => {
    const date = form.getValues('date')
    if (date && startDate < date && date < endDate) {
      return
    }
    form.setValue('date', startDate)
    setSelectedDate(startDate)
  }, [form, startDate, endDate])
  useEffect(() => {
    setLayout({
      title: t('pages.iznos'),
      content: SearchFilterDebounced,
      enableSaldo: true,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ]
    })
  }, [setLayout])

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
              placeholder={t('group')}
              getName={(selected) => `${selected.group_number ?? ''} / ${selected.name}`}
              getElements={(selected) => [{ name: t('name'), value: selected.name }]}
            />

            <ChooseSpravochnik
              spravochnik={responsibleSpravochnik}
              placeholder={t('responsible')}
              getName={(selected) => selected.fio}
              getElements={(selected) => [
                { name: t('fio'), value: selected.fio },
                { name: t('podrazdelenie'), value: selected.spravochnik_podrazdelenie_jur7_name }
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
                  validate={validateDateWithinSelectedMonth}
                  calendarProps={{
                    fromMonth: startDate,
                    toMonth: endDate
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
          columnDefs={IznosColumns}
          data={iznos?.data ?? []}
          getRowId={(row) => row.product_id}
          getRowKey={(row) => row.id}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  colSpan={7}
                />
                <FooterCell content={formatNumber(iznos?.meta?.page_to_kol ?? 0)} />
                <FooterCell content={formatNumber(iznos?.meta?.page_to_summa ?? 0)} />
                <FooterCell
                  colSpan={6}
                  content={formatNumber(iznos?.meta?.page_to_iznos_summa ?? 0)}
                />
              </FooterRow>
              <FooterRow>
                <FooterCell
                  title={t('total_period')}
                  colSpan={7}
                />
                <FooterCell content={formatNumber(iznos?.meta?.to_kol ?? 0)} />
                <FooterCell content={formatNumber(iznos?.meta?.to_summa ?? 0)} />
                <FooterCell
                  colSpan={6}
                  content={formatNumber(iznos?.meta?.to_iznos_summa ?? 0)}
                />
              </FooterRow>
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          count={iznos?.meta?.count ?? 0}
          pageCount={iznos?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default IznosPage
