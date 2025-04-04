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
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { prixodbookQueryKeys } from '../config'
import { prixodbookService } from '../service'
import { defaultValues } from './config'
import { PrixodbookTable } from './prixodbook-table'
import { provodkiColumns } from './provodki'
import {
  type PrixodbookAutoFillSubChild,
  autoFillPrixodbookData,
  getPrixodbookTypes
} from './service'
import {
  getPrixodbookColumns,
  transformGetByIdData,
  transformPrixodbookAutoFillData
} from './utils'

const PrixodbookDetailsPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { id } = useParams()
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

  const { data: prixodbook, isFetching } = useQuery({
    queryKey: [prixodbookQueryKeys.getById, Number(id)],
    queryFn: prixodbookService.getById,
    enabled: id !== 'create'
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [prixodbookQueryKeys.getTypes, { budjet_id }],
    queryFn: getPrixodbookTypes
  })
  const { isPending: isAutoFillingPrixodbook, mutate: autoFillPrixodbook } = useMutation({
    mutationKey: [prixodbookQueryKeys.autoFill],
    mutationFn: autoFillPrixodbookData,
    onSuccess: (res) => {
      if (res?.data) {
        form.setValue('childs', transformPrixodbookAutoFillData(res.data))
      }
    }
  })

  const { mutate: createPrixodbook, isPending: isCreatingPrixodbook } = useMutation({
    mutationFn: prixodbookService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [prixodbookQueryKeys.getAll]
      })
      navigate(-1)
    }
  })
  const { mutate: updatePrixodbook, isPending: isUpdatingPrixodbook } = useMutation({
    mutationFn: prixodbookService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [prixodbookQueryKeys.getAll]
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
    if (prixodbook?.data) {
      form.reset({
        month: prixodbook.data.month,
        year: prixodbook.data.year,
        childs: transformGetByIdData(prixodbook.data.childs)
      })
    }
  }, [form, prixodbook, id])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.prixodbook')
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, t, id])
  useEffect(() => {
    if (id === 'create') {
      autoFillPrixodbook({ year, month, budjet_id: budjet_id! })
    }
  }, [id, year, month, budjet_id])

  const columns = useMemo(
    () => [...provodkiColumns, ...getPrixodbookColumns(types?.data ?? [])],
    [types]
  )

  const onSubmit = form.handleSubmit((values) => {
    if (!types?.data) {
      return
    }

    values.childs.pop()

    const payload: {
      type_id: number
      sub_childs: PrixodbookAutoFillSubChild[]
    }[] = []

    types?.data?.forEach((type) => {
      payload.push({
        type_id: type.id,
        sub_childs: values.childs.map((child) => {
          return {
            schet: child.schet,
            prixod: child[`${type.id}_prixod`] || 0,
            rasxod: child[`${type.id}_rasxod`] || 0
          } as PrixodbookAutoFillSubChild
        })
      })
    })

    if (id === 'create') {
      createPrixodbook({
        month: values.month,
        year: values.year,
        childs: payload
      })
    } else {
      updatePrixodbook({
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

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={isFetching || isAutoFillingPrixodbook || isFetchingTypes}
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
                      autoFillPrixodbook({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        budjet_id: budjet_id!
                      })
                    }
                  }}
                />
                {id !== 'create' ? (
                  <Button
                    type="button"
                    onClick={() => autoFillPrixodbook({ year, month, budjet_id: budjet_id! })}
                    loading={isAutoFillingPrixodbook}
                  >
                    {t('autofill')}
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <PrixodbookTable
                columns={columns}
                data={form.watch('childs')}
                methods={tableMethods}
              />
            </div>
          </div>

          <DetailsView.Footer>
            <Button
              type="submit"
              disabled={isCreatingPrixodbook || isUpdatingPrixodbook}
              loading={isCreatingPrixodbook || isUpdatingPrixodbook}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default PrixodbookDetailsPage
