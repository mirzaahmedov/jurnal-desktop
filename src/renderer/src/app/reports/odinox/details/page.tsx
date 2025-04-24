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
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import { OdinoxQueryKeys } from '../config'
import { OdinoxService } from '../service'
import { defaultValues } from './config'
// import { MainbookDocumentsTracker } from './documents-tracker'
import { OdinoxTable } from './odinox-table'
import { OdinoxProvodkaColumns } from './provodki'
import {
  getOdinoxColumns,
  transformGetByIdData,
  transformOdinoxAutoFillData,
  transformOdinoxAutoFillDataToSave
} from './utils'

const OdinoxDetailsPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  // const [activeCell, setActiveCell] = useState<{
  //   type: string
  //   smeta_id: number
  // }>()

  const { id } = useParams()
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
      form.setValue('childs', transformOdinoxAutoFillData(res.data ?? []))
    },
    onError: () => {
      form.setValue('childs', [])
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
        childs: transformGetByIdData(odinox.data.childs)
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
    if (!types?.data) {
      return
    }

    values.childs.pop()

    const payload = transformOdinoxAutoFillDataToSave(types?.data ?? [], values)

    if (id === 'create') {
      createOdinox({
        month: values.month,
        year: values.year,
        childs: payload
      })
    } else {
      updateOdinox({
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
          row.smeta_number?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  // const handleCellDoubleClick = useCallback<CellEventHandler<OdinoxFormValues, 'childs'>>(
  //   ({ column, row }) => {
  //     if (column.key === 'smeta_name' || column.key === 'smeta_number') {
  //       return
  //     }

  //     setActiveCell({
  //       type: column.key as string,
  //       smeta_id: row.smeta_id
  //     })
  //   },
  //   []
  // )

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={isFetching || isAutoFilling || isFetchingTypes}
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
              <OdinoxTable
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
              disabled={isCreatingOdinox || isUpdatingOdinox}
              loading={isCreatingOdinox || isUpdatingOdinox}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>
      </DetailsView.Content>

      {/* <MainbookDocumentsTracker
        isOpen={!!activeCell}
        onOpenChange={(open) => {
          if (!open) {
            setActiveCell(undefined)
          }
        }}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        month={month}
        year={year}
        type_id={activeCell?.type_id}
        schet={activeCell?.schet}
        prixod={activeCell?.prixod}
      /> */}
    </DetailsView>
  )
}

export default OdinoxDetailsPage
