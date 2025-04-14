import type { EditableTableMethods } from '@/common/components/editable-table'
import type { OrganSaldoProvodka } from '@/common/models'

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { defaultValues } from '../config'
import { OrganSaldoQueryKeys } from '../config'
import { OrganSaldoService } from '../service'
import { OrganSaldoTable } from './organ-saldo-table'
import { getOrganSaldoProvodkaColumns } from './provodki'
import { calculateTotal } from './utils'

const OrganSaldoDetailsPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const [isEditable, setEditable] = useState(false)

  const { id } = useParams()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id, jur3_schet_159_id } = useRequisitesStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1
    }
  })

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [OrganSaldoQueryKeys.getById, Number(id)],
    queryFn: OrganSaldoService.getById,
    enabled: id !== 'create'
  })

  const { isPending: isCheckingSaldo, mutate: checkSaldo } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.getCheckSaldo],
    mutationFn: OrganSaldoService.getSaldoCheck,
    onSuccess: () => {
      autoFill({
        year,
        month,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        schet_id: jur3_schet_159_id!,
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
          schet_id: jur3_schet_159_id!,
          first: true
        })
        return
      }
      toast.error(error?.message)
    }
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.getAutofill],
    mutationFn: OrganSaldoService.getAutofillData,
    onSuccess: (res) => {
      if (res?.data?.length) {
        const total = calculateTotal(res.data)
        res.data.push({
          _total: true,
          organization_id: 0,
          name: t('total'),
          prixod: total.prixod,
          rasxod: total.rasxod
        } as OrganSaldoProvodka)
      }
      form.setValue('organizations', res?.data ?? [])
    },
    onError: () => {
      form.setValue('organizations', [])
    }
  })

  const { mutate: createMainbook, isPending: isCreatingMainbook } = useMutation({
    mutationFn: OrganSaldoService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3_159, res)

      navigate(-1)
    }
  })
  const { mutate: updateMainbook, isPending: isUpdatingMainbook } = useMutation({
    mutationFn: OrganSaldoService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3_159, res)

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
        organizations: []
      })
      return
    }
    if (saldo?.data) {
      if (saldo.data.childs?.length) {
        const total = calculateTotal(saldo.data.childs)
        saldo.data.childs.push({
          _total: true,
          organization_id: 0,
          name: t('total'),
          prixod: total.prixod,
          rasxod: total.rasxod
        } as OrganSaldoProvodka)
      }
      form.reset({
        month: saldo.data.month,
        year: saldo.data.year,
        organizations: saldo.data.childs ?? []
      })
      setEditable(saldo.data.first)
    }
  }, [form, saldo, id, startDate])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.mainbook')
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
        schet_id: jur3_schet_159_id!
      })
    }
  }, [id, year, month, budjet_id, main_schet_id, jur3_schet_159_id])

  const onSubmit = form.handleSubmit((values) => {
    values.organizations.pop()

    if (id === 'create') {
      createMainbook(values)
    } else {
      updateMainbook({
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
        const rows = form.getValues('organizations')
        const index = rows.findIndex((row) =>
          row.name?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.setHighlightedRows([index])
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  const rows = useWatch({
    control: form.control,
    name: 'organizations'
  })
  useEffect(() => {
    if (!isEditable || rows.length === 0) {
      return
    }

    const total = calculateTotal(rows)
    const totalRow = rows[rows.length - 1]
    const name = t('total')

    if (Number(totalRow?.prixod) !== Number(total.prixod)) {
      form.setValue(`organizations.${rows.length - 1}.prixod`, total.prixod)
    }
    if (Number(totalRow?.rasxod) !== Number(total.rasxod)) {
      form.setValue(`organizations.${rows.length - 1}.rasxod`, total.rasxod)
    }
    if (totalRow?.name !== name) {
      form.setValue(`organizations.${rows.length - 1}.name`, name)
    }
  }, [rows, form, isEditable, t])

  const columns = useMemo(() => getOrganSaldoProvodkaColumns(isEditable), [isEditable])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_159, error)
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
                  disabled={isEditable}
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
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_159_id!,
                        first: isEditable
                      })
                    }
                  }}
                />
                {id !== 'create' && !isEditable ? (
                  <Button
                    type="button"
                    onClick={() => {
                      autoFill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_159_id!,
                        first: false
                      })
                    }}
                    loading={isAutoFilling}
                  >
                    {t('autofill')}
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <OrganSaldoTable
                columnDefs={columns}
                methods={tableMethods}
                form={form}
                name="organizations"
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

export default OrganSaldoDetailsPage
