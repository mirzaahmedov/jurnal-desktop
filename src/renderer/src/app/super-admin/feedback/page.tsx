import type { IFeedBack } from '@/common/features/feedback/model'
import type { CustomCellRendererProps } from 'ag-grid-react'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { GridTable } from '@/common/components/grid-table/table'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { FeedbackQueryKeys, FeedbackService } from '@/common/features/feedback/service'
import { DownloadFile } from '@/common/features/file'
import { useLayout } from '@/common/layout'
import { baseURL } from '@/common/lib/http'

const FeedbackPage = () => {
  const { t } = useTranslation(['app'])

  const { confirm } = useConfirm()
  const { data: feedbacks, isFetching } = useQuery({
    queryKey: FeedbackQueryKeys.getAll(),
    queryFn: FeedbackService.getAll
  })

  const setLayout = useLayout()
  const queryClient = useQueryClient()
  const feedbackDelete = useMutation({
    mutationFn: FeedbackService.delete
  })

  useEffect(() => {
    setLayout({
      title: t('pages.feedback'),
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <GridTable
      rowData={feedbacks?.data ?? []}
      columnDefs={[
        { headerName: 'ID', field: 'id', width: 80 },
        { headerName: t('fio'), field: 'fio', width: 400 },
        { headerName: t('login'), field: 'login', width: 200 },
        { headerName: t('region'), field: 'region_name', width: 200 },
        { headerName: t('message'), field: 'message', flex: 1 },
        {
          headerName: t('additional_file'),
          field: 'file',
          flex: 1,
          cellClass: '!px-0',
          cellRenderer: (props: CustomCellRendererProps<IFeedBack>) => {
            const fileUrl = `${baseURL}/general/error/file/${props.data?.file}`
            return props.data?.file ? (
              <DownloadFile
                fileName={props.data.file}
                buttonText={props.data.file}
                url={fileUrl}
                params={{}}
                className="rounded-none"
              />
            ) : (
              '-'
            )
          }
        },
        {
          headerName: t('actions'),
          field: 'actions',
          width: 100,
          cellRenderer: (props: CustomCellRendererProps<IFeedBack>) => {
            return (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:!text-red-600"
                onClick={() => {
                  if (props.data?.id) {
                    const id = props.data.id
                    confirm({
                      onConfirm: () => {
                        feedbackDelete.mutate(id, {
                          onSuccess: () => {
                            queryClient.invalidateQueries({
                              queryKey: FeedbackQueryKeys.getAll()
                            })
                          }
                        })
                      }
                    })
                  }
                }}
              >
                <Trash2 className="size-5" />
              </Button>
            )
          }
        }
      ]}
      loading={isFetching}
    />
  )
}

export default FeedbackPage
