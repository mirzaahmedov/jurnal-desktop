import type { CellEventHandler, EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
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
import { type OdinoxFormValues, defaultValues } from './config'
import { MainbookDocumentsTracker } from './documents-tracker'
import { MainbookTable } from './mainbook-table'
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

  const [isEditable, setEditable] = useState(false)
  const [activeCell, setActiveCell] = useState<{
    type_id: number
    schet: string
    prixod: boolean
  }>()

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

  const { isPending: isFetchingUniqueSchets, mutate: getUniqueSchets } = useMutation({
    mutationKey: [OdinoxQueryKeys.getUniqueSchets],
    mutationFn: OdinoxService.getUniqueSchets,
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
    mutationKey: [OdinoxQueryKeys.getCheckSaldo],
    mutationFn: OdinoxService.getSaldoCheck,
    onSuccess: () => {
      autoFill({ year, month, budjet_id: budjet_id!, main_schet_id: main_schet_id! })
    },
    onError: (error) => {
      if ('status' in error && error.status === 404) {
        getUniqueSchets({
          budjet_id: budjet_id!,
          main_schet_id: main_schet_id!
        })
        return
      }
      autoFill({ year, month, budjet_id: budjet_id!, main_schet_id: main_schet_id! })
    }
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [OdinoxQueryKeys.getAutofill],
    mutationFn: OdinoxService.getAutofillData,
    onSuccess: (res) => {
      form.setValue('childs', transformOdinoxAutoFillData(res.data ?? []))
      setEditable(false)
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
      if (odinox?.data?.first) {
        setEditable(true)
      }
    }
  }, [form, odinox, id])
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
        main_schet_id: main_schet_id!
      })
    }
  }, [id, year, month, budjet_id])

  const columns = useMemo(
    () => [...OdinoxProvodkaColumns, ...getOdinoxColumns(types?.data ?? [], isEditable)],
    [types, isEditable]
  )

  const onSubmit = form.handleSubmit((values) => {
    if (!types?.data) {
      return
    }

    const itogo = values.childs.pop()

    if (isEditable && itogo && itogo?.['10_prixod'] !== itogo?.['10_rasxod']) {
      toast.error(t('prixod_rasxod_mismatch'))
      return
    }

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
          row.schet?.toLowerCase()?.includes(value?.toLowerCase())
        )
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

  const handleCellDoubleClick = useCallback<CellEventHandler<OdinoxFormValues, 'childs'>>(
    ({ column, row, rows, value, index }) => {
      if (index === rows.length - 1 || !value) {
        return
      }

      const type_id = Number(column.key.split('_')[0])
      const prixod = column.key.endsWith('_prixod')
      const schet = row.schet

      if (type_id < 1 || type_id > 8) {
        return
      }

      setActiveCell({
        type_id,
        schet,
        prixod
      })
    },
    []
  )

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
                  isDisabled={id !== 'create' && isEditable}
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
                {id !== 'create' && !isEditable ? (
                  <Button
                    type="button"
                    onClick={() => {
                      autoFill({
                        year,
                        month,
                        budjet_id: budjet_id!,
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
              <MainbookTable
                columns={columns}
                methods={tableMethods}
                form={form}
                name="childs"
                onCellDoubleClick={!isEditable ? handleCellDoubleClick : undefined}
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

      <MainbookDocumentsTracker
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
      />
    </DetailsView>
  )
}

export default OdinoxDetailsPage
