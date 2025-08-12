import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useEffect, useMemo, useRef } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { FinancialReceiptQueryKeys } from '../config'
import { FinancialReceiptService } from '../service'
import { FinancialReceiptDetailsColumns } from './columns'
import { defaultValues } from './config'
import { FinancialReceiptMonitorTable } from './monitor-table'

const FinancialReceiptDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1
    }
  })

  const { data: monitor, isFetching } = useQuery({
    queryKey: [
      FinancialReceiptQueryKeys.getById,
      Number(id),
      {
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!
      }
    ],
    queryFn: FinancialReceiptService.getMonitorById,
    enabled: id !== 'create'
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [FinancialReceiptQueryKeys.getAutofillData],
    mutationFn: FinancialReceiptService.getAutofillData,
    onSuccess: (res) => {
      const childs = res?.data?.childs ?? []
      if (childs.length > 0) {
        childs.push({
          doc_num: t('total'),
          doc_date: '',
          schet: '',
          rasxod_schet: '',
          document_id: 0,
          doc_id: 0,
          schet_id: 0,
          type_doc: '',
          summa: res?.data?.summa ?? 0
        })
      }
      form.setValue('childs', childs)
    },
    onError: () => {
      form.setValue('childs', [])
    }
  })

  const { mutate: createMonitor, isPending: isCreatingMonitor } = useMutation({
    mutationFn: FinancialReceiptService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [FinancialReceiptQueryKeys.getAll]
      })
      navigate(-1)
    }
  })
  const { mutate: updateMonitor, isPending: isUpdatingMonitor } = useMutation({
    mutationFn: FinancialReceiptService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [FinancialReceiptQueryKeys.getAll]
      })
      navigate(-1)
    }
  })

  const year = form.watch('year')
  const month = form.watch('month')
  const date = useMemo(() => formatDate(new Date(year, month - 1)), [year, month])

  useEffect(() => {
    if (id === 'create') {
      form.reset({
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        childs: []
      })
      return
    }
    if (monitor?.data) {
      const childs = monitor?.data?.childs ?? []
      if (childs.length > 0) {
        childs.push({
          doc_num: t('total'),
          doc_date: '',
          schet: '',
          rasxod_schet: '',
          document_id: 0,
          doc_id: 0,
          schet_id: 0,
          type_doc: '',
          summa: monitor?.data?.summa ?? 0
        })
      }
      form.reset({
        month: monitor.data.month,
        year: monitor.data.year,
        childs: childs
      })
    }
  }, [form, monitor, id, startDate])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.jur_8_old')
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, t, id])
  useEffect(() => {
    if (id === 'create') {
      autoFill({
        year,
        month,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!
      })
    }
  }, [id, year, month, budjet_id])

  const onSubmit = form.handleSubmit((values) => {
    values.childs.pop()

    if (id === 'create') {
      createMonitor({
        month: values.month,
        year: values.year,
        childs: values.childs
      })
    } else {
      updateMonitor({
        id: Number(id),
        month: values.month,
        year: values.year,
        childs: values.childs
      })
    }
  })

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        const rows = form.getValues('childs')
        const index = rows.findIndex((row) =>
          row.doc_num?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        isLoading={isFetching || isAutoFilling}
        className="overflow-hidden h-full pb-20"
      >
        <form
          noValidate
          onSubmit={onSubmit}
          className="h-full"
        >
          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between gap-5 p-5 border-b">
              <SearchInput onKeyDown={handleSearch} />
              <div className="flex items-center gap-5">
                <MonthPicker
                  value={date}
                  onChange={(value) => {
                    const date = new Date(value)
                    form.setValue('year', date.getFullYear())
                    form.setValue('month', date.getMonth() + 1)
                    if (id !== 'create') {
                      autoFill({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!
                      })
                    }
                  }}
                />
                {id !== 'create' ? (
                  <Button
                    type="button"
                    onClick={() =>
                      autoFill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!
                      })
                    }
                    isPending={isAutoFilling}
                  >
                    {t('autofill')}
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <FinancialReceiptMonitorTable
                columns={FinancialReceiptDetailsColumns}
                form={form}
                name="childs"
                methods={tableMethods}
              />
            </div>
          </div>

          <DetailsView.Footer>
            <Button
              type="submit"
              disabled={isCreatingMonitor || isUpdatingMonitor}
              isPending={isCreatingMonitor || isUpdatingMonitor}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default FinancialReceiptDetailsPage
