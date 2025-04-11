import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useEffect, useMemo, useRef } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { MainbookTable } from '@/app/reports/mainbook/details/mainbook-table'
import { MainbookProvodkaColumns, type ProvodkaRow } from '@/app/reports/mainbook/details/provodki'
import { getMainbookColumns, transformGetByIdData } from '@/app/reports/mainbook/details/utils'
import { MainbookService } from '@/app/reports/mainbook/service'
import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
import { MainbookStatus } from '@/common/models'
import { DetailsView } from '@/common/views'

import { mainbookQueryKeys } from '../config'
import { adminMainbookService } from '../service'

const AdminMainbookDetailsPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { id } = useParams()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      childs: [] as ProvodkaRow[]
    }
  })

  const { data: mainbook, isFetching } = useQuery({
    queryKey: [mainbookQueryKeys.getById, Number(id)],
    queryFn: adminMainbookService.getById,
    enabled: id !== 'create'
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [mainbookQueryKeys.getTypes, {}],
    queryFn: MainbookService.getTypes
  })

  const { mutate: updateMainbook, isPending: isUpdatingMainbook } = useMutation({
    mutationFn: adminMainbookService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [mainbookQueryKeys.getAll]
      })
      navigate(-1)
    }
  })

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

  const columns = useMemo(
    () => [...MainbookProvodkaColumns, ...getMainbookColumns(types?.data ?? [])],
    [types]
  )
  useEffect(() => {
    const rows = transformGetByIdData(mainbook?.data?.childs ?? [])
    form.setValue('childs', rows)
    form.setValue('year', mainbook?.data?.year ?? new Date().getFullYear())
    form.setValue('month', mainbook?.data?.month ?? new Date().getMonth() + 1)
  }, [mainbook])

  const handleReject = () => {
    confirm({
      title: t('reject_report'),
      onConfirm: () => {
        updateMainbook({
          id: Number(id),
          status: MainbookStatus.REJECT
        })
      }
    })
  }
  const handleAccept = () => {
    confirm({
      title: t('accept_report'),
      onConfirm: () => {
        updateMainbook({
          id: Number(id),
          status: MainbookStatus.ACCEPT
        })
      }
    })
  }

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        const rows: ProvodkaRow[] = form.getValues('childs')
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
        loading={isFetching || isFetchingTypes || isUpdatingMainbook}
        className="h-full pb-20 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between gap-5 p-5 border-b">
            <SearchInput onKeyDown={handleSearch} />
            <MonthPicker
              disabled
              value={
                mainbook?.data
                  ? formatDate(new Date(mainbook.data.year ?? 0, mainbook.data.month - 1))
                  : formatDate(new Date())
              }
              onChange={() => {}}
              className="disabled:opacity-100"
            />
          </div>
          <div className="relative flex-1 overflow-auto scrollbar">
            <MainbookTable
              columns={columns}
              form={form}
              name="childs"
              methods={tableMethods}
            />
          </div>
        </div>
        <DetailsView.Footer className="flex gap-5">
          <Button
            disabled={isUpdatingMainbook}
            type="button"
            onClick={handleAccept}
          >
            {t('accept')}
          </Button>
          <Button
            disabled={isUpdatingMainbook}
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

export default AdminMainbookDetailsPage
