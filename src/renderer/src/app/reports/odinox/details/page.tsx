import type { CellEventHandler, EditableTableMethods } from '@/common/components/editable-table'
import type { OdinoxDocument } from '@/common/models'

import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/jolly/button'
import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { OdinoxQueryKeys } from '../config'
import { type GetDocsArgs, OdinoxService } from '../service'
import { type OdinoxFormValues, defaultValues } from './config'
import { OdinoxDocumentsTracker } from './documents-tracker'
import { OdinoxTable } from './odinox-table'
import { OdinoxProvodkaColumns } from './provodki'
import { getOdinoxColumns, transformGetByIdData, transformOdinoxAutoFillData } from './utils'

const OdinoxDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const tableMethods = useRef<EditableTableMethods>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<{
    docs: OdinoxDocument[]
    args: GetDocsArgs
  }>()

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: location.state?.year ?? new Date().getFullYear(),
      month: new Date().getMonth() + 1
    }
  })

  const { data: odinox, isFetching } = useQuery({
    queryKey: [
      OdinoxQueryKeys.getById,
      Number(id),
      {
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: OdinoxService.getById,
    enabled: id !== 'create' && !!budjet_id && !!main_schet_id
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [
      OdinoxQueryKeys.getTypes,
      {
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!
      }
    ],
    queryFn: OdinoxService.getTypes,
    enabled: !!budjet_id
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [OdinoxQueryKeys.getAutofill],
    mutationFn: OdinoxService.getAutofillData,
    onSuccess: (res) => {
      form.setValue('childs', res.data ?? [])
      form.setValue('title', res?.meta?.title ?? '')
      form.setValue('title_summa', res?.meta?.title_summa ?? 0)
      form.setValue('summa_from', res?.meta?.summa_from ?? 0)
      form.setValue('summa_to', res?.meta?.summa_to ?? 0)
      form.setValue(
        'rows',
        transformOdinoxAutoFillData(
          res.data ?? [],
          res?.meta ?? {
            title_summa: 0,
            title: '',
            summa_from: 0,
            summa_to: 0
          }
        )
      )
    },
    onError: () => {
      form.setValue('childs', [])
      form.setValue('rows', [])
    }
  })
  const { mutate: getDocs } = useMutation({
    mutationKey: [OdinoxQueryKeys.getDocs],
    mutationFn: OdinoxService.getDocs,
    onSuccess: (res, args) => {
      setSelected({
        docs: Array.isArray(res.data) ? res.data : [],
        args
      })
    },
    onError: () => {
      setSelected(undefined)
    }
  })

  const { mutate: createOdinox, isPending: isCreatingOdinox } = useMutation({
    mutationFn: OdinoxService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OdinoxQueryKeys.getAll]
      })
      navigate(-1)
    }
  })
  const { mutate: updateOdinox, isPending: isUpdatingOdinox } = useMutation({
    mutationFn: OdinoxService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OdinoxQueryKeys.getAll]
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
    if (odinox?.data) {
      form.reset({
        month: odinox.data.month,
        year: odinox.data.year,
        rows: transformGetByIdData(
          odinox.data.childs,
          odinox?.meta ?? {
            title_summa: 0,
            title: '',
            summa_from: 0,
            summa_to: 0
          }
        ),
        childs: odinox.data.childs
      })
    }
  }, [form, odinox, id])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.odinox')
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

  const columns = useMemo(
    () => [...OdinoxProvodkaColumns, ...getOdinoxColumns(types?.data ?? [])],
    [types]
  )

  const onSubmit = form.handleSubmit((values) => {
    if (id === 'create') {
      createOdinox({
        month: values.month,
        year: values.year,
        title: values.title,
        title_summa: values.title_summa,
        summa_from: values.summa_from,
        summa_to: values.summa_to,
        childs: values.childs
      })
    } else {
      updateOdinox({
        id: Number(id),
        month: values.month,
        year: values.year,
        title: values.title,
        title_summa: values.title_summa,
        summa_from: values.summa_from,
        summa_to: values.summa_to,
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
        const rows = form.getValues('rows')
        const index = rows.findIndex((row) =>
          row.smeta_number?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  const handleCellDoubleClick = useCallback<CellEventHandler<OdinoxFormValues, 'rows'>>(
    ({ row, column, index }) => {
      const type = types?.data?.find((type) => type.name === column.key)
      if (index === 0) {
        getDocs({
          title: true,
          sort_order: '',
          smeta_id: '',
          month: form.getValues('month'),
          year: form.getValues('year'),
          need_data: [],
          main_schet_id: main_schet_id!
        })
        return
      }
      if (!type) {
        return
      }
      getDocs({
        month: form.getValues('month'),
        year: form.getValues('year'),
        need_data: form.getValues('childs'),
        smeta_id: row.smeta_id,
        main_schet_id: main_schet_id!,
        sort_order: type.sort_order
      })
    },
    [form, types, main_schet_id]
  )

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        isLoading={isFetching || isAutoFilling || isFetchingTypes}
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
                    isPending={isAutoFilling}
                  >
                    {t('autofill')}
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <OdinoxTable
                columns={columns}
                methods={tableMethods}
                form={form}
                name="rows"
                onCellDoubleClick={handleCellDoubleClick}
              />
            </div>
          </div>

          <DetailsView.Footer>
            <Button
              type="submit"
              isPending={isCreatingOdinox || isUpdatingOdinox}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>
      </DetailsView.Content>
      <OdinoxDocumentsTracker
        docs={selected?.docs ?? []}
        args={selected?.args}
        onClose={() => setSelected(undefined)}
      />
    </DetailsView>
  )
}

export default OdinoxDetailsPage
