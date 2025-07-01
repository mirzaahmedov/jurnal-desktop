import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { createResponsibleSpravochnik } from '@/app/jur_7/responsible/service'
import { CommonWarehouseSaldoProductColumns } from '@/app/jur_7/saldo/columns'
import { SaldoQueryKeys, defaultValues } from '@/app/jur_7/saldo/config'
import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { ChooseSpravochnik, DatePicker, GenericTable } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { FormField } from '@/common/components/ui/form'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useSpravochnik } from '@/common/features/spravochnik'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate, parseDate } from '@/common/lib/date'
import { capitalize } from '@/common/lib/string'
import { ListView } from '@/common/views'

import { AdminWarehouseSaldoService } from './service'

const MaterialWarehouseSaldoPage = () => {
  const pagination = usePagination()
  const setLayout = useLayout()

  const [selectedDate, setSelectedDate] = useState<undefined | Date>(new Date())
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

  const groupSpravochnik = useSpravochnik(createGroupSpravochnik({}))
  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  const { data: saldos, isFetching } = useQuery({
    queryKey: [
      SaldoQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        to: formatDate(selectedDate!),
        search,
        responsible_id: responsibleSpravochnik.selected?.id,
        group_id: groupSpravochnik.selected?.id
      }
    ],
    queryFn: AdminWarehouseSaldoService.getAll,
    enabled: false && !!selectedDate
  })

  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      content: SearchFilterDebounced
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
              spravochnik={groupSpravochnik}
              placeholder={capitalize(t('choose', { what: t('group') }))}
              getName={(selected) => `${selected.group_number ?? ''} - ${selected.name}`}
              getElements={(selected) => [{ name: t('name'), value: selected.name }]}
            />

            <ChooseSpravochnik
              spravochnik={responsibleSpravochnik}
              placeholder={capitalize(t('choose', { what: t('responsible') }))}
              getName={(selected) => selected.fio}
              getElements={(selected) => [
                { name: t('fio'), value: selected.fio },
                { name: t('podrazdelenie'), value: selected.spravochnik_podrazdelenie_jur7_name }
              ]}
            />
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
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          columnDefs={CommonWarehouseSaldoProductColumns}
          data={saldos?.data ?? []}
          getRowId={(row) => row.product_id}
          getRowKey={(row) => row.id}
        />
      </ListView.Content>

      <ListView.Footer>
        <ListView.Pagination
          pageCount={saldos?.meta?.pageCount ?? 0}
          count={saldos?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default MaterialWarehouseSaldoPage
