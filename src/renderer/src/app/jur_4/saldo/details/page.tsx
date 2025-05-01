import type { EditableTableMethods } from '@/common/components/editable-table'
import type { PodotchetSaldoProvodka } from '@/common/models'

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { PodotchetSaldoQueryKeys, defaultValues } from '../config'
import { PodotchetSaldoService } from '../service'
import { usePodotchetSaldo } from '../use-saldo'
import { PodotchetSaldoTable } from './podotchet-saldo-table'
import { getPodochetSaldoProvodkaColumns } from './provodki'
import { calculateTotal } from './utils'

const PodotchetSaldoDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const { queuedMonths } = usePodotchetSaldo()

  const [isEditable, setEditable] = useState(false)

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id, jur4_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: location.state?.year ?? startDate.getFullYear(),
      month: startDate.getMonth() + 1
    }
  })

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [PodotchetSaldoQueryKeys.getById, Number(id)],
    queryFn: PodotchetSaldoService.getById,
    enabled: id !== 'create' && !queuedMonths.length
  })

  const { isPending: isCheckingSaldo, mutate: checkSaldo } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.getCheckSaldo],
    mutationFn: PodotchetSaldoService.getSaldoCheck,
    onSuccess: () => {
      autoFill({
        year,
        month,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        schet_id: jur4_schet_id!,
        first: false
      })
    },
    onError: (error) => {
      if ('status' in error && error.status === 404) {
        setEditable(true)
        autoFill({
          year,
          month,
          budjet_id: budjet_id!,
          main_schet_id: main_schet_id!,
          schet_id: jur4_schet_id!,
          first: true
        })
        return
      }
      toast.error(error?.message)
    }
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.getAutofill],
    mutationFn: PodotchetSaldoService.getAutofillData,
    onSuccess: (res, values) => {
      let data: PodotchetSaldoProvodka[] = []

      if (!isEditable) {
        data = res?.data ?? []
      } else {
        const prevData = form.getValues('podotchets')
        const newData = res?.data ?? []

        data = newData.map((item) => {
          const prev = prevData.find((prev) => prev.podotchet_id === item.podotchet_id)
          return {
            ...item,
            prixod: prev?.prixod ?? 0,
            rasxod: prev?.rasxod ?? 0
          } satisfies PodotchetSaldoProvodka
        })
      }

      if (data.length) {
        const total = calculateTotal(data)
        data.push({
          id: 0,
          _total: true,
          podotchet_id: 0,
          name: t('total'),
          rayon: '',
          isdeleted: false,
          prixod: total.prixod,
          rasxod: total.rasxod
        } as PodotchetSaldoProvodka)
      }

      form.setValue('podotchets', data)
      setEditable(values.first)
    },
    onError: () => {
      form.setValue('podotchets', [])
    }
  })

  const { mutate: createSaldo, isPending: isCreatingMainbook } = useMutation({
    mutationFn: PodotchetSaldoService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)

      navigate(-1)
    }
  })
  const { mutate: updateSaldo, isPending: isUpdatingMainbook } = useMutation({
    mutationFn: PodotchetSaldoService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)

      navigate(-1)
    }
  })

  const year = form.watch('year')
  const month = form.watch('month')
  const date = useMemo(() => formatDate(new Date(year, month - 1)), [year, month])

  useEffect(() => {
    if (saldo?.data) {
      if (saldo.data.childs?.length) {
        const total = calculateTotal(saldo.data.childs)
        saldo.data.childs.push({
          _total: true,
          podotchet_id: 0,
          name: t('total'),
          prixod: total.prixod,
          rasxod: total.rasxod
        } as any)
      }
      form.reset({
        month: saldo.data.month,
        year: saldo.data.year,
        podotchets: saldo.data.childs ?? []
      })
      setEditable(saldo.data.first)
    }
  }, [form, saldo, id, startDate])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, t, id])
  useEffect(() => {
    if (id === 'create') {
      checkSaldo({
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        schet_id: jur4_schet_id!
      })
    }
  }, [id, year, month, budjet_id, main_schet_id, jur4_schet_id])

  const onSubmit = form.handleSubmit((values) => {
    values.podotchets.pop()

    if (id === 'create') {
      createSaldo(values)
    } else {
      updateSaldo({
        id: Number(id),
        ...values
      })
    }
  })

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        const rows = form.getValues('podotchets')
        const index = rows.findIndex((row) =>
          row.name?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  const rows = useWatch({
    control: form.control,
    name: 'podotchets'
  })
  useEffect(() => {
    if (!isEditable || rows.length === 0) {
      return
    }

    const total = calculateTotal(rows, true)
    const totalRow = rows[rows.length - 1]
    const name = t('total')

    if (Number(totalRow?.prixod) !== Number(total.prixod)) {
      form.setValue(`podotchets.${rows.length - 1}.prixod`, total.prixod)
    }
    if (Number(totalRow?.rasxod) !== Number(total.rasxod)) {
      form.setValue(`podotchets.${rows.length - 1}.rasxod`, total.rasxod)
    }
    if (totalRow?.name !== name) {
      form.setValue(`podotchets.${rows.length - 1}.name`, name)
    }
  }, [rows, form, isEditable, t])

  const columns = useMemo(() => getPodochetSaldoProvodkaColumns(isEditable), [isEditable])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  }, [error])

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={isFetching || isAutoFilling || isCheckingSaldo}
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
                    if (id !== 'create' && !isEditable) {
                      autoFill({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur4_schet_id!,
                        first: isEditable
                      })
                    }
                  }}
                />
                {id !== 'create' &&
                  (isEditable ? (
                    <Button
                      type="button"
                      onClick={() => {
                        autoFill({
                          year,
                          month,
                          budjet_id: budjet_id!,
                          main_schet_id: main_schet_id!,
                          schet_id: jur4_schet_id!,
                          first: true
                        })
                      }}
                      loading={isAutoFilling}
                    >
                      {t('update_data')}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        autoFill({
                          year,
                          month,
                          budjet_id: budjet_id!,
                          main_schet_id: main_schet_id!,
                          schet_id: jur4_schet_id!,
                          first: false
                        })
                      }}
                      loading={isAutoFilling}
                    >
                      {t('autofill')}
                    </Button>
                  ))}
              </div>
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <PodotchetSaldoTable
                columnDefs={columns}
                methods={tableMethods}
                form={form}
                name="podotchets"
              />
            </div>
          </div>

          <DetailsView.Footer>
            <Button
              type="submit"
              disabled={isCreatingMainbook || isUpdatingMainbook}
              loading={isCreatingMainbook || isUpdatingMainbook}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default PodotchetSaldoDetailsPage
