import type { EditableColumnDef } from '@renderer/common/components/editable-table/interface'

import { useEffect, useMemo } from 'react'

import { EditableTable } from '@renderer/common/components/editable-table'
import { createNumberEditor } from '@renderer/common/components/editable-table/editors'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { Button } from '@renderer/common/components/ui/button'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
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
import { provodkiColumns } from './provodki'
import { type MainbookAutoFillSubChild, getMainbookAutoFill, getMainbookTypes } from './service'
import { transformGetByIdData, transformMainbookAutofillData } from './utils'

const MainbookDetailsPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
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
  const {
    data: autofill,
    isFetching: isFetchingAutofill,
    refetch
  } = useQuery({
    queryKey: [
      mainbookQueryKeys.getAutoFill,
      {
        budjet_id: budjet_id!,
        month: form.watch('month'),
        year: form.watch('year')
      }
    ],
    queryFn: getMainbookAutoFill,
    enabled: false
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
    if (autofill?.data) {
      form.setValue('childs', transformMainbookAutofillData(autofill.data))
    }
  }, [autofill])

  const columns = useMemo(
    () => [
      ...provodkiColumns,
      ...(types?.data?.flatMap((type) => {
        const jurNumber = type.name.match(/\d+/)?.[0]
        return [
          {
            key: type.id,
            header: t('mainbook.mo-nth', { nth: jurNumber }),
            headerClassName: 'text-center',
            columns: [
              {
                key: `${type.id}_rasxod`,
                width: 150,
                minWidth: 150,
                header: t('rasxod'),
                headerClassName: 'text-center',
                Editor: createNumberEditor({
                  key: `${type.id}_rasxod`,
                  readOnly: true,
                  defaultValue: 0
                })
              },
              {
                key: `${type.id}_prixod`,
                width: 150,
                minWidth: 150,
                header: t('prixod'),
                headerClassName: 'text-center',
                Editor: createNumberEditor({
                  key: `${type.id}_prixod`,
                  readOnly: true,
                  defaultValue: 0
                })
              }
            ]
          }
        ] as EditableColumnDef<any>[]
      }) ?? [])
    ],
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
        loading={isFetching || isFetchingAutofill || isFetchingTypes}
        className="overflow-hidden h-full pb-20"
      >
        <form
          onSubmit={onSubmit}
          className="h-full"
        >
          <div className="relative p-5 h-full flex flex-col gap-5">
            <div className="flex items-center justify-between gap-5">
              <MonthPicker
                value={date}
                onChange={(value) => {
                  const date = new Date(value)
                  form.setValue('year', date.getFullYear())
                  form.setValue('month', date.getMonth() + 1)
                }}
              />
              <Button
                type="button"
                onClick={() => refetch()}
                loading={isFetchingAutofill}
              >
                {t('autofill')}
              </Button>
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <EditableTable
                columnDefs={columns}
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
