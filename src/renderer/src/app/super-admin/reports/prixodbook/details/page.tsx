import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useEffect, useMemo, useRef } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { PrixodbookTable } from '@/app/reports/prixodbook/details/prixodbook-table'
import { type ProvodkaRow, provodkiColumns } from '@/app/reports/prixodbook/details/provodki'
import { getPrixodbookTypes } from '@/app/reports/prixodbook/details/service'
import { getPrixodbookColumns, transformGetByIdData } from '@/app/reports/prixodbook/details/utils'
import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Button } from '@/common/components/ui/button'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
import { PrixodbookStatus } from '@/common/models'
import { DetailsView } from '@/common/views'

import { prixodbookQueryKeys } from '../config'
import { adminPrixodbookService } from '../service'

const AdminPrixodbookDetailsPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { id } = useParams()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: prixodbook, isFetching } = useQuery({
    queryKey: [prixodbookQueryKeys.getById, Number(id)],
    queryFn: adminPrixodbookService.getById,
    enabled: id !== 'create'
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [prixodbookQueryKeys.getTypes, {}],
    queryFn: getPrixodbookTypes
  })

  const { mutate: updatePrixodbook, isPending: isUpdatingPrixodbook } = useMutation({
    mutationFn: adminPrixodbookService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [prixodbookQueryKeys.getAll]
      })
      navigate(-1)
    }
  })

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

  const columns = useMemo(
    () => [...provodkiColumns, ...getPrixodbookColumns(types?.data ?? [])],
    [types]
  )
  const data = useMemo(() => transformGetByIdData(prixodbook?.data?.childs ?? []), [prixodbook])

  const handleReject = () => {
    confirm({
      title: t('reject_report'),
      onConfirm: () => {
        updatePrixodbook({
          id: Number(id),
          status: PrixodbookStatus.REJECT
        })
      }
    })
  }
  const handleAccept = () => {
    confirm({
      title: t('accept_report'),
      onConfirm: () => {
        updatePrixodbook({
          id: Number(id),
          status: PrixodbookStatus.ACCEPT
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
        const rows: ProvodkaRow[] = data
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
        loading={isFetching || isFetchingTypes || isUpdatingPrixodbook}
        className="h-full pb-20 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between gap-5 p-5 border-b">
            <SearchInput onKeyDown={handleSearch} />
            <MonthPicker
              disabled
              value={
                prixodbook?.data
                  ? formatDate(new Date(prixodbook.data.year ?? 0, prixodbook.data.month - 1))
                  : formatDate(new Date())
              }
              onChange={() => {}}
              className="disabled:opacity-100"
            />
          </div>
          <div className="relative flex-1 overflow-auto scrollbar">
            <PrixodbookTable
              columns={columns}
              data={data}
              methods={tableMethods}
            />
          </div>
        </div>
        <DetailsView.Footer className="flex gap-5">
          <Button
            disabled={isUpdatingPrixodbook}
            type="button"
            onClick={handleAccept}
          >
            {t('accept')}
          </Button>
          <Button
            disabled={isUpdatingPrixodbook}
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

export default AdminPrixodbookDetailsPage
