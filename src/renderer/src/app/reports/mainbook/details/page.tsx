import { useEffect, useMemo } from 'react'

import { MonthPicker } from '@renderer/common/components/month-picker'
import { Button } from '@renderer/common/components/ui/button'
import { useLayoutStore } from '@renderer/common/features/layout'
import { formatDate } from '@renderer/common/lib/date'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { mainbookQueryKeys } from '../config'
import { mainbookService } from '../service'
import { defaultValues } from './config'
import { MainbookTable } from './mainbook-table'
import { provodkiColumns } from './provodki'
import { type MainbookAutoFillSubChild, autoFillMainbookData, getMainbookTypes } from './service'
import { getMainbookColumns, transformGetByIdData, transformMainbookAutoFillData } from './utils'

const MainbookDetailsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { id } = useParams()
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

  const { data: mainbook, isFetching } = useQuery({
    queryKey: [mainbookQueryKeys.getById, Number(id)],
    queryFn: mainbookService.getById,
    enabled: id !== 'create'
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [mainbookQueryKeys.getTypes],
    queryFn: getMainbookTypes
  })
  const { isPending: isAutoFillingMainbook, mutate: autoFillMainbook } = useMutation({
    mutationKey: [mainbookQueryKeys.autoFill],
    mutationFn: autoFillMainbookData,
    onSuccess: (res) => {
      if (res?.data) {
        form.setValue('childs', transformMainbookAutoFillData(res.data))
      }
    }
  })

  const { mutate: createMainbook, isPending: isCreatingMainbook } = useMutation({
    mutationFn: mainbookService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [mainbookQueryKeys.getAll]
      })
      navigate(-1)
    }
  })
  const { mutate: updateMainbook, isPending: isUpdatingMainbook } = useMutation({
    mutationFn: mainbookService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [mainbookQueryKeys.getAll]
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
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        childs: []
      })
      return
    }
    if (mainbook?.data) {
      form.reset({
        month: mainbook.data.month,
        year: mainbook.data.year,
        childs: transformGetByIdData(mainbook.data.childs)
      })
    }
  }, [form, mainbook, id])
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
      autoFillMainbook({ year, month })
    }
  }, [id, year, month])

  const columns = useMemo(
    () => [...provodkiColumns, ...getMainbookColumns(types?.data ?? [])],
    [types]
  )

  const onSubmit = form.handleSubmit((values) => {
    if (!types?.data) {
      return
    }

    const payload: {
      type_id: number
      sub_childs: MainbookAutoFillSubChild[]
    }[] = []

    types?.data?.forEach((type) => {
      payload.push({
        type_id: type.id,
        sub_childs: values.childs.map((child) => {
          return {
            schet: child.schet,
            prixod: child[`${type.id}_prixod`] || 0,
            rasxod: child[`${type.id}_rasxod`] || 0
          } as MainbookAutoFillSubChild
        })
      })
    })

    if (id === 'create') {
      createMainbook({
        month: values.month,
        year: values.year,
        childs: payload.filter((child) => child.type_id !== 9)
      })
    } else {
      updateMainbook({
        id: Number(id),
        month: values.month,
        year: values.year,
        childs: payload.filter((child) => child.type_id !== 9)
      })
    }
  })

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={isFetching || isAutoFillingMainbook || isFetchingTypes}
        className="overflow-hidden h-full pb-20"
      >
        <form
          onSubmit={onSubmit}
          className="h-full"
        >
          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between gap-5 p-5 border-b">
              <MonthPicker
                value={date}
                onChange={(value) => {
                  const date = new Date(value)
                  form.setValue('year', date.getFullYear())
                  form.setValue('month', date.getMonth() + 1)
                  if (id !== 'create') {
                    autoFillMainbook({ year: date.getFullYear(), month: date.getMonth() + 1 })
                  }
                }}
              />
              {id !== 'create' ? (
                <Button
                  type="button"
                  onClick={() => autoFillMainbook({ year, month })}
                  loading={isAutoFillingMainbook}
                >
                  {t('autofill')}
                </Button>
              ) : null}
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <MainbookTable
                columns={columns}
                data={form.watch('childs')}
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

export default MainbookDetailsPage
