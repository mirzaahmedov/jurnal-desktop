import type { EditableColumnDef } from '@renderer/common/components/editable-table'

import { useEffect, useMemo } from 'react'

import { EditableTable } from '@renderer/common/components/editable-table'
import { createNumberEditor } from '@renderer/common/components/editable-table/editors'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { Button } from '@renderer/common/components/ui/button'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayoutStore } from '@renderer/common/features/layout'
import { formatDate } from '@renderer/common/lib/date'
import { MainbookStatus } from '@renderer/common/models'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { transformGetByIdData } from '@/app/reports/mainbook/details/utils'

import { mainbookQueryKeys } from '../config'
import { adminMainbookService } from '../service'
import { provodkiColumns } from './provodki'
import { getMainbookTypes } from './service'

const AdminMainbookDetailsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { id } = useParams()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: mainbook, isFetching } = useQuery({
    queryKey: [mainbookQueryKeys.getById, Number(id)],
    queryFn: adminMainbookService.getById,
    enabled: id !== 'create'
  })
  const { data: types, isFetching: isFetchingTypes } = useQuery({
    queryKey: [mainbookQueryKeys.getTypes],
    queryFn: getMainbookTypes
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
    () => [
      ...provodkiColumns,
      ...(types?.data?.flatMap((type) => {
        const jurNum = type.name.match(/\d+/)?.[0]
        return [
          {
            key: type.id,
            header: jurNum ? t('mainbook.mo-nth', { nth: jurNum }) : t(`mainbook.${type.name}`),
            headerClassName: 'text-center',
            columns: [
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
              },
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
              }
            ]
          }
        ] as EditableColumnDef<any>[]
      }) ?? [])
    ],
    [types]
  )

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

  const data = useMemo(() => transformGetByIdData(mainbook?.data?.childs ?? []), [mainbook])

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        loading={isFetching || isFetchingTypes || isUpdatingMainbook}
        className="h-full pb-20 overflow-hidden"
      >
        <div className="h-full flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between gap-5">
            <MonthPicker
              disabled
              value={
                mainbook?.data
                  ? formatDate(new Date(mainbook.data.year ?? 0, mainbook.data.month - 1))
                  : formatDate(new Date())
              }
              onChange={() => {}}
            />
          </div>
          <div className="relative flex-1 overflow-auto scrollbar">
            <EditableTable
              columnDefs={columns}
              data={data}
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
