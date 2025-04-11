import type { EditableTableMethods } from '@/common/components/editable-table'

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
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { MainbookQueryKeys } from '../config'
import { MainbookService } from '../service'
import { defaultValues } from './config'
import { type MainbookAutoFillSubChild } from './interfaces'
import { MainbookTable } from './mainbook-table'
import { provodkiColumns } from './provodki'
import { getMainbookColumns, transformGetByIdData, transformMainbookAutoFillData } from './utils'

const MainbookDetailsPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const [isEditable, setEditable] = useState(false)

  const { id } = useParams()
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

  const { data: mainbook, isFetching } = useQuery({
    queryKey: [MainbookQueryKeys.getById, Number(id)],
    queryFn: MainbookService.getById,
    enabled: id !== 'create'
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [
      MainbookQueryKeys.getTypes,
      {
        budjet_id: budjet_id!
      }
    ],
    queryFn: MainbookService.getTypes,
    enabled: !!budjet_id
  })

  const { isPending: isFetchingUniqueSchets, mutate: getUniqueSchets } = useMutation({
    mutationKey: [MainbookQueryKeys.getUniqueSchets],
    mutationFn: MainbookService.getUniqueSchets,
    onSuccess: (res) => {
      const uniqueSchets = res.data?.schets ?? []
      const childs = uniqueSchets.map((schet) => ({
        schet: schet.schet,
        '10_prixod': 0,
        '10_rasxod': 0
      }))
      childs.push({
        schet: t('total'),
        '10_prixod': 0,
        '10_rasxod': 0
      })
      form.setValue('childs', childs)
      setEditable(true)
    },
    onError: () => {
      form.setValue('childs', [])
    }
  })

  const { isPending: isCheckingSaldo, mutate: checkSaldo } = useMutation({
    mutationKey: [MainbookQueryKeys.getCheckSaldo],
    mutationFn: MainbookService.getSaldoCheck,
    onSuccess: () => {
      autoFill({ year, month, budjet_id: budjet_id! })
    },
    onError: (error) => {
      if ('status' in error && error.status === 404) {
        getUniqueSchets({
          budjet_id: budjet_id!
        })
        return
      }
      autoFill({ year, month, budjet_id: budjet_id! })
    }
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [MainbookQueryKeys.getAutofill],
    mutationFn: MainbookService.getAutofillData,
    onSuccess: (res) => {
      form.setValue('childs', transformMainbookAutoFillData(res.data ?? []))
      setEditable(false)
    },
    onError: () => {
      form.setValue('childs', [])
    }
  })

  const { mutate: createMainbook, isPending: isCreatingMainbook } = useMutation({
    mutationFn: MainbookService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [MainbookQueryKeys.getAll]
      })
      navigate(-1)
    }
  })
  const { mutate: updateMainbook, isPending: isUpdatingMainbook } = useMutation({
    mutationFn: MainbookService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [MainbookQueryKeys.getAll]
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
      checkSaldo({
        budjet_id: budjet_id!
      })
    }
  }, [id, year, month, budjet_id])

  const columns = useMemo(
    () => [...provodkiColumns, ...getMainbookColumns(types?.data ?? [], isEditable)],
    [types, isEditable]
  )

  const onSubmit = form.handleSubmit((values) => {
    if (!types?.data) {
      return
    }

    values.childs.pop()

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
        childs: payload
      })
    } else {
      updateMainbook({
        id: Number(id),
        month: values.month,
        year: values.year,
        childs: payload
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
          row.schet?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.setHighlightedRows([index])
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  const rows = useWatch({
    control: form.control,
    name: 'childs'
  })
  useEffect(() => {
    if (!isEditable || rows.length === 0) {
      return
    }

    let itogoPrixod = 0
    let itogoRasxod = 0

    rows.forEach((row, index) => {
      if (index !== rows.length - 1) {
        itogoPrixod += row?.[`10_prixod`] || 0
        itogoRasxod += row?.[`10_rasxod`] || 0
      }
    })

    const itogoRow = rows[rows.length - 1]
    if (itogoRow?.['10_prixod'] !== itogoPrixod) {
      form.setValue(`childs.${rows.length - 1}.10_prixod` as any, itogoPrixod)
    }
    if (itogoRow?.['10_rasxod'] !== itogoRasxod) {
      form.setValue(`childs.${rows.length - 1}.10_rasxod` as any, itogoRasxod)
    }
  }, [rows, form, isEditable, t])

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={
          isFetching ||
          isAutoFilling ||
          isFetchingTypes ||
          isFetchingUniqueSchets ||
          isCheckingSaldo
        }
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
                      checkSaldo({
                        budjet_id: budjet_id!
                      })
                    }
                  }}
                />
                {id !== 'create' ? (
                  <Button
                    type="button"
                    onClick={() => {
                      checkSaldo({
                        budjet_id: budjet_id!
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
              <MainbookTable
                columns={columns}
                methods={tableMethods}
                form={form}
                name="childs"
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
