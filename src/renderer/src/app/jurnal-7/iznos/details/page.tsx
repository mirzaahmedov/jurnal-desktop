import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { useDefaultFilters } from '@renderer/common/features/app-defaults'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import {
  formatDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  parseDate
} from '@renderer/common/lib/date'
import { DetailsView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { ostatokQueryKeys } from '@/app/jurnal-7/ostatok'

import { provodkaColumns } from './columns'
import {
  IznosFormSchema,
  IznosProductFormSchema,
  type IznosProductFormValues,
  defaultValues
} from './config'
import { getOstatokProducts } from './service'

const IznosDetailsPage = () => {
  const tableRef = useRef<HTMLTableElement>(null)

  const { from } = useDefaultFilters()

  const [date, setDate] = useState(parseDate(from))

  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(IznosFormSchema)
  })
  const { data: ostatok, isFetching } = useQuery({
    queryKey: [
      ostatokQueryKeys.getAll,
      {
        from: formatDate(getFirstDayOfMonth(date)),
        to: formatDate(getLastDayOfMonth(date)),
        budjet_id: budjet_id!
      }
    ],
    queryFn: getOstatokProducts,
    enabled: !!budjet_id
  })

  useEffect(() => {
    const products: IznosProductFormValues[] =
      ostatok?.data?.products?.map((product) => {
        const {
          eski_iznos_summa,
          iznos_summa,
          kol,
          month,
          year,
          new_summa,
          responsible_id,
          sena,
          summa
        } = product.iznos_data ?? {}
        return {
          id: product.id,
          name: product.name,
          group_name: product.group.name,
          iznos_foiz: product.group.iznos_foiz,
          eski_iznos_summa,
          iznos_summa,
          kol,
          month,
          year,
          new_summa,
          responsible_id,
          sena,
          summa,
          inventar_num: product.inventar_num,
          serial_num: product.serial_num
        } satisfies IznosProductFormValues
      }) ?? []
    form.setValue('products', products)
  }, [ostatok])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <div className="flex flex-col gap-10 p-10">
          <div>
            <MonthPicker
              value={formatDate(date)}
              onChange={(value) => {
                setDate(parseDate(value))
              }}
            />
          </div>
          <div>
            <EditableTable
              tableRef={tableRef}
              tabIndex={5}
              columns={provodkaColumns}
              data={form.watch('products')}
              errors={form.formState.errors.products}
              onCreate={createEditorCreateHandler({
                form,
                schema: IznosProductFormSchema,
                defaultValues: defaultValues.products[0],
                field: 'grafiks'
              })}
              onDelete={createEditorDeleteHandler({
                form,
                field: 'grafiks'
              })}
              onChange={createEditorChangeHandler({
                form,
                field: 'grafiks'
              })}
              validate={({ id, key, payload }) => {
                if (key !== 'smeta_id') {
                  return true
                }

                return !form.getValues('products').some((child, index) => {
                  if (id !== index && payload.smeta_id === child.smeta_id) {
                    toast.error('Проводка с этой сметой уже существует')

                    const input = tableRef?.current?.querySelector(
                      `[data-editorid="${index}-smeta_id"]`
                    ) as HTMLInputElement
                    if (input) {
                      setTimeout(() => {
                        input.focus()
                      }, 100)
                    }

                    return true
                  }
                  return false
                })
              }}
            />
          </div>
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default IznosDetailsPage
