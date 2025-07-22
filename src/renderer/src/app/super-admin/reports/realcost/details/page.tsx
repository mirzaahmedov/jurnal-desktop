import type { RealCostTableRow } from '@/app/reports/real-cost/details/interfaces'
import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useEffect, useMemo, useRef } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { defaultValues } from '@/app/reports/real-cost/details/config'
import { RealCostTable } from '@/app/reports/real-cost/details/realcost-table'
import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { ReportStatus } from '@/common/models'
import { DetailsView } from '@/common/views'

import { AdminRealCostQueryKeys } from '../config'
import { AdminRealCostService } from '../service'

const AdminRealCostDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const tableMethods = useRef<EditableTableMethods>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: location.state?.year ?? new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      itogo: {} as RealCostTableRow
    }
  })

  const { data: realCost, isFetching } = useQuery({
    queryKey: [AdminRealCostQueryKeys.getById, Number(id)],
    queryFn: AdminRealCostService.getById
  })

  const { mutate: updateRealCost, isPending: isUpdatingOdinox } = useMutation({
    mutationFn: AdminRealCostService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [AdminRealCostQueryKeys.getAll]
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
      const data = realCost.data
      const meta = realCost.meta
      const itogo = {} as RealCostTableRow
      if (meta) {
        itogo.first = true
        itogo.rasxod_summa = meta.by_month.rasxod_summa
        itogo.remaining_summa = meta.by_month.remaining_summa
        itogo.contract_grafik_summa = meta.by_month.contract_grafik_summa
        itogo.rasxod_summa_year = meta.by_year.rasxod_summa
        itogo.remaining_summa_year = meta.by_year.remaining_summa
        itogo.contract_grafik_summa_year = meta.by_year.contract_grafik_summa
      }

      form.reset({
        month: data.month,
        year: data.year,
        childs: data.childs ?? [],
        itogo
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

  const itogo = form.watch('itogo') ?? {}
  const childs = form.watch('childs') ?? []
  const rows = useMemo(() => {
    const rows: RealCostTableRow[] = []
    childs.map((row) => {
      const size = Math.max(row.by_month.length, row.by_year.length, 1)

      for (let i = 0; i < size; i++) {
        rows.push({
          first: i === 0,
          size: size,
          smeta_id: row.smeta_id,
          id: row.id,
          smeta_name: row.smeta_name,
          smeta_number: row.smeta_number,
          month_summa: row.month_summa ?? 0,
          year_summa: row.year_summa ?? 0,
          doc_num: row.by_month[i]?.doc_num ?? '',
          doc_date: row.by_month[i]?.doc_date ?? '',
          name: row.by_month[i]?.name ?? '',
          contract_grafik_summa: row.by_month[i]?.contract_grafik_summa ?? 0,
          rasxod_summa: row.by_month[i]?.rasxod_summa ?? 0,
          remaining_summa: row.by_month[i]?.remaining_summa ?? 0,
          doc_num_year: row.by_year[i]?.doc_num ?? '',
          doc_date_year: row.by_year[i]?.doc_date ?? '',
          name_year: row.by_year[i]?.name ?? '',
          contract_grafik_summa_year: row.by_year[i]?.contract_grafik_summa ?? 0,
          rasxod_summa_year: row.by_year[i]?.rasxod_summa ?? 0,
          remaining_summa_year: row.by_year[i]?.remaining_summa ?? 0,
          grafik_id: row.by_month[i]?.id,
          grafik_id_year: row.by_year[i]?.id
        })
      }
    })
    return rows
  }, [form, childs])

  const handleReject = () => {
    confirm({
      title: t('reject_report'),
      onConfirm: () => {
        updateRealCost({
          id: Number(id),
          status: ReportStatus.REJECT
        })
      }
    })
  }
  const handleAccept = () => {
    confirm({
      title: t('accept_report'),
      onConfirm: () => {
        updateRealCost({
          id: Number(id),
          status: ReportStatus.ACCEPT
        })
      }
    })
  }

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        isLoading={isFetching}
        className="overflow-hidden h-full pb-20"
      >
        <div className="relative h-full flex flex-col">
          <div className="flex items-center justify-between gap-5 p-5 border-b">
            <SearchInput onKeyDown={handleSearch} />
            <div className="flex items-center gap-5">
              <MonthPicker
                readOnly
                popoverProps={{
                  placement: 'bottom end'
                }}
                value={date}
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="overflow-auto scrollbar flex-1 relative">
            <RealCostTable
              rows={rows}
              methods={tableMethods}
              itogo={itogo}
            />
          </div>
        </div>

        <DetailsView.Footer className="flex gap-5">
          <Button
            disabled={isUpdatingOdinox}
            type="button"
            onClick={handleAccept}
          >
            {t('accept')}
          </Button>
          <Button
            disabled={isUpdatingOdinox}
            type="button"
            variant="destructive"
            onClick={handleReject}
          >
            {t('reject')}
          </Button>
        </DetailsView.Footer>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default AdminRealCostDetailsPage
