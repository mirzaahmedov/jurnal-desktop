import type { TwoFSaldoFormValues } from './config'
import type { ApiResponse, Smeta } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { CircleCheck, RefreshCcw, Trash2 } from 'lucide-react'
import { type DialogTriggerProps } from 'react-aria-components'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { EditorTable } from '@/common/components/editor-table/editor-table'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { YearSelect } from '@/common/components/year-select'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { api } from '@/common/lib/http'

import { TwoFSaldoService } from './service'

export const TwoFSaldoDialog = (props: Omit<DialogTriggerProps, 'children'>) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()
  const { main_schet_id } = useRequisitesStore()

  const [isEditing, setIsEditing] = useState(false)
  const [totalValues, setTotalValues] = useState<TwoFSaldoFormValues['smetas']>([
    {
      smeta_id: 0,
      smeta_number: t('total'),
      bank_prixod: 0,
      jur1_jur2_rasxod: 0,
      jur3a_akt_avans: 0
    }
  ])

  const form = useForm<TwoFSaldoFormValues>({
    defaultValues: {
      year: new Date().getFullYear(),
      smetas: []
    }
  })

  const fetchSaldoData = useMutation({
    mutationFn: TwoFSaldoService.getAll,
    onSuccess: (res) => {
      const newValues = (res.data || [])?.map((item) => ({
        smeta_id: item.smeta_id,
        smeta_number: item.smeta_number,
        bank_prixod: item.bank_prixod,
        jur1_jur2_rasxod: item.jur1_jur2_rasxod,
        jur3a_akt_avans: item.jur3a_akt_avans
      }))

      form.setValue('smetas', newValues)

      const totals = {
        smeta_id: 0,
        smeta_number: t('total'),
        bank_prixod: 0,
        jur1_jur2_rasxod: 0,
        jur3a_akt_avans: 0
      }

      newValues.forEach((item) => {
        totals.bank_prixod += item.bank_prixod
        totals.jur1_jur2_rasxod += item.jur1_jur2_rasxod
        totals.jur3a_akt_avans += item.jur3a_akt_avans
      })

      setTotalValues([totals])
    }
  })

  const createTwoFSaldo = useMutation({
    mutationFn: TwoFSaldoService.create,
    onSuccess: (res) => {
      toast.success(res.message ?? t('create_success'))
      props.onOpenChange?.(false)
    }
  })
  const updateTwoFSaldo = useMutation({
    mutationFn: TwoFSaldoService.update,
    onSuccess: (res) => {
      toast.success(res.message ?? t('create_success'))
      props.onOpenChange?.(false)
    }
  })
  const deleteTwoFSaldo = useMutation({
    mutationFn: TwoFSaldoService.delete,
    onSuccess: (res) => {
      toast.success(res.message ?? t('delete_success'))
    }
  })
  const fetchSmetas = useMutation({
    mutationFn: async () => {
      const res = await api.get<ApiResponse<Smeta[]>>('/smeta', {
        params: {
          page: 1,
          limit: 1000000
        }
      })
      return res.data
    },
    onSuccess: (res) => {
      if (!res.data) {
        return
      }
      const prevData = form.getValues('smetas')
      const newValues = res.data?.map((smeta) => {
        const prev = prevData.find((item) => item.smeta_id === smeta.id)
        return {
          smeta_id: smeta.id,
          smeta_number: smeta.smeta_number,
          bank_prixod: prev?.bank_prixod ?? 0,
          jur1_jur2_rasxod: prev?.jur1_jur2_rasxod ?? 0,
          jur3a_akt_avans: prev?.jur3a_akt_avans ?? 0
        }
      })
      form.setValue('smetas', newValues)

      const totals = {
        smeta_id: 0,
        smeta_number: t('total'),
        bank_prixod: 0,
        jur1_jur2_rasxod: 0,
        jur3a_akt_avans: 0
      }

      newValues.forEach((item) => {
        totals.bank_prixod += item.bank_prixod
        totals.jur1_jur2_rasxod += item.jur1_jur2_rasxod
        totals.jur3a_akt_avans += item.jur3a_akt_avans
      })

      setTotalValues([totals])
    }
  })
  const checkSaldoMutation = useMutation({
    mutationFn: TwoFSaldoService.checkSaldo
  })

  const year = form.watch('year')
  useEffect(() => {
    if (main_schet_id && props.isOpen) {
      checkSaldoMutation.mutate(
        {
          main_schet_id
        },
        {
          onSuccess: (res) => {
            const year = res?.data?.year
            if (year) {
              setIsEditing(true)
              form.setValue('year', year)
              fetchSaldoData.mutate({
                main_schet_id,
                year
              })
            } else {
              setIsEditing(false)
            }
          }
        }
      )
    }
  }, [props.isOpen, checkSaldoMutation.mutate, fetchSaldoData.mutate, main_schet_id, year])

  const handleSubmit = form.handleSubmit((values) => {
    if (isEditing) {
      updateTwoFSaldo.mutate(values)
    } else {
      createTwoFSaldo.mutate(values)
    }
  })

  const handleDelete = () => {
    confirm({
      onConfirm: () => {
        deleteTwoFSaldo.mutate(
          {
            year
          },
          {
            onSuccess: () => {
              if (main_schet_id) {
                fetchSaldoData.mutate({
                  year,
                  main_schet_id
                })
              }
            }
          }
        )
      }
    })
  }

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="h-full max-h-[800px] w-full max-w-7xl">
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>{t('saldo')}</DialogTitle>

              <div className="flex flex-row gap-5">
                <Button
                  IconStart={RefreshCcw}
                  onClick={() => {
                    fetchSmetas.mutate()
                  }}
                >
                  {t('autofill')}
                </Button>
                {isEditing ? (
                  <Button
                    variant="destructive"
                    IconStart={Trash2}
                    onClick={() => {
                      handleDelete()
                    }}
                  >
                    {t('delete')}
                  </Button>
                ) : null}
                <YearSelect
                  isReadOnly={isEditing}
                  selectedKey={form.watch('year')}
                  onSelectionChange={(value) => {
                    form.setValue('year', value ? Number(value) : new Date().getFullYear())
                  }}
                />
              </div>
            </DialogHeader>
            <div className="flex-1">
              <EditorTable
                form={form}
                loading={
                  fetchSmetas.isPending || fetchSaldoData.isPending || checkSaldoMutation.isPending
                }
                columnDefs={[
                  {
                    field: 'smeta_number',
                    headerName: t('smeta'),
                    cellClass: 'font-bold'
                  },
                  {
                    flex: 1,
                    field: 'jur3a_akt_avans',
                    headerName: t('real_expenses'),
                    cellRendererSelector: (params) => {
                      if (params.node.rowPinned === 'bottom') {
                        return { component: 'numberCell' }
                      }
                      return { component: 'numberEditor' }
                    },
                    cellClassRules: {
                      'font-bold': (params) => params.node.rowPinned === 'bottom'
                    }
                  },
                  {
                    flex: 1,
                    field: 'jur1_jur2_rasxod',
                    headerName: `${t('provodka_type.bank_rasxod')}, ${t('provodka_type.bank_prixod')}, ${t('provodka_type.kassa_prixod')}`,
                    cellRendererSelector: (params) => {
                      if (params.node.rowPinned === 'bottom') {
                        return { component: 'numberCell' }
                      }
                      return { component: 'numberEditor' }
                    },
                    cellClassRules: {
                      'font-bold': (params) => params.node.rowPinned === 'bottom'
                    }
                  },
                  {
                    flex: 1,
                    field: 'bank_prixod',
                    headerName: t('funds_paid_by_ministry'),
                    cellRendererSelector: (params) => {
                      if (params.node.rowPinned === 'bottom') {
                        return { component: 'numberCell' }
                      }
                      return { component: 'numberEditor' }
                    },
                    cellClassRules: {
                      'font-bold': (params) => params.node.rowPinned === 'bottom'
                    }
                  }
                ]}
                arrayField="smetas"
                pinnedBottomRowData={totalValues}
                onValueEdited={(_, field) => {
                  const rows = form.getValues('smetas')
                  let total = 0
                  rows.forEach((row) => {
                    total += row[field] ? Number(row[field]) : 0
                  })
                  setTotalValues((prev) => {
                    const prevValues = prev[0]
                    return [
                      {
                        ...prevValues,
                        [field]: total
                      }
                    ]
                  })
                }}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                IconStart={CircleCheck}
              >
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
