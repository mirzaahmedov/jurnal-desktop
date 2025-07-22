import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useEffect, useMemo, useRef } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { OdinoxQueryKeys } from '@/app/reports/odinox/config'
import { OdinoxService } from '@/app/reports/odinox/service'
import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { ReportStatus } from '@/common/models'
import { DetailsView } from '@/common/views'

import { AdminOdinoxQueryKeys } from '../config'
import { AdminOdinoxService } from '../service'
import { defaultValues } from './config'
import { OdinoxTable } from './odinox-table'
import { OdinoxProvodkaColumns } from './provodki'
import { getOdinoxColumns, transformGetByIdData } from './utils'

const AdminOdinoxDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const tableMethods = useRef<EditableTableMethods>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: location.state?.year ?? new Date().getFullYear(),
      month: new Date().getMonth() + 1
    }
  })

  const { data: odinox, isFetching } = useQuery({
    queryKey: [AdminOdinoxQueryKeys.getById, Number(id)],
    queryFn: AdminOdinoxService.getById,
    enabled: id !== 'create'
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [OdinoxQueryKeys.getTypes, {}],
    queryFn: OdinoxService.getTypes
  })

  const { mutate: updateOdinox, isPending: isUpdatingOdinox } = useMutation({
    mutationFn: AdminOdinoxService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [AdminOdinoxQueryKeys.getAll]
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
        childs: transformGetByIdData(
          odinox.data.childs,
          odinox.meta ?? {
            title: '',
            summa: 0,
            summa_from: 0,
            summa_to: 0
          }
        )
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

  const columns = useMemo(
    () => [...OdinoxProvodkaColumns, ...getOdinoxColumns(types?.data ?? [])],
    [types]
  )

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

  const handleReject = () => {
    confirm({
      title: t('reject_report'),
      onConfirm: () => {
        updateOdinox({
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
        updateOdinox({
          id: Number(id),
          status: ReportStatus.ACCEPT
        })
      }
    })
  }

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={isFetching || isFetchingTypes}
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
            <OdinoxTable
              columns={columns}
              methods={tableMethods}
              form={form}
              name="childs"
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

export default AdminOdinoxDetailsPage
