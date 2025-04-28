import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useEffect, useMemo, useRef } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { RealCostQueryKeys } from '../config'
import { RealCostService } from '../service'
import { defaultValues } from './config'
import { RealCostTable } from './realcost-table'

const RealCostDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const tableMethods = useRef<EditableTableMethods>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])

  const { budjet_id, main_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: location.state?.year ?? new Date().getFullYear(),
      month: new Date().getMonth() + 1
    }
  })

  const { data: realCost, isFetching } = useQuery({
    queryKey: [
      RealCostQueryKeys.getById,
      Number(id),
      {
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: RealCostService.getById,
    enabled: id !== 'create' && !!budjet_id && !!main_schet_id
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [RealCostQueryKeys.getAutofill],
    mutationFn: RealCostService.getAutofillData,
    onSuccess: (res) => {
      form.setValue('childs', res?.data ?? [])
    },
    onError: () => {
      form.setValue('childs', [])
    }
  })

  const { mutate: createRealCost, isPending: isCreatingOdinox } = useMutation({
    mutationFn: RealCostService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [RealCostQueryKeys.getAll]
      })
      navigate(-1)
    }
  })
  const { mutate: updateRealCost, isPending: isUpdatingOdinox } = useMutation({
    mutationFn: RealCostService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [RealCostQueryKeys.getAll]
      })
      navigate(-1)
    }
  })

  const year = form.watch('year')
  const month = form.watch('month')
  const date = useMemo(() => formatDate(new Date(year, month - 1)), [year, month])

  useEffect(() => {
    if (id === 'create') {
      return
    }
    if (realCost?.data) {
      form.reset({
        month: realCost.data.month,
        year: realCost.data.year,
        childs: realCost.data.childs ?? []
      })
    }
  }, [form, realCost, id])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.realcost')
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
        year: form.getValues('year'),
        month: form.getValues('month'),
        main_schet_id: main_schet_id!
      })
    }
  }, [id, year, month, budjet_id])

  const onSubmit = form.handleSubmit((values) => {
    values.childs.pop()

    if (id === 'create') {
      createRealCost({
        month: values.month,
        year: values.year,
        childs: values.childs
      })
    } else {
      updateRealCost({
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
          row.smeta_number?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={isFetching || isAutoFilling}
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
                  popoverProps={{
                    placement: 'bottom end'
                  }}
                  value={date}
                  onChange={(value) => {
                    const date = new Date(value)
                    form.setValue('year', date.getFullYear())
                    form.setValue('month', date.getMonth() + 1)
                    if (id !== 'create') {
                      autoFill({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        main_schet_id: main_schet_id!
                      })
                    }
                  }}
                />
                {id !== 'create' ? (
                  <Button
                    type="button"
                    onClick={() => {
                      autoFill({
                        year,
                        month,
                        main_schet_id: main_schet_id!
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
              <RealCostTable
                rows={form.watch('childs') ?? []}
                methods={tableMethods}
              />
            </div>
          </div>

          <DetailsView.Footer>
            <Button
              type="submit"
              disabled={isCreatingOdinox || isUpdatingOdinox}
              loading={isCreatingOdinox || isUpdatingOdinox}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default RealCostDetailsPage
