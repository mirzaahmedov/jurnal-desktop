import { useCallback, useEffect, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { Card } from '@renderer/common/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter
} from '@renderer/common/components/ui/dialog'
import { DownloadFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { bytesToMegaBytes } from '@renderer/common/lib/file'
import { http } from '@renderer/common/lib/http'
import { ListView } from '@renderer/common/views'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { File, Import, Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FileDropzone, GenericTable, LoadingSpinner } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'

import { DateRangeForm } from '../common/components/date-range-form'
import { useJurnal7DateRange } from '../common/components/use-date-range'
import { columns, queryKeys } from './config'
import { usePrixodDelete, usePrixodList } from './service'

const MO7PrixodPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const [file, setFile] = useState<File>()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const setLayout = useLayoutStore((store) => store.setLayout)
  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { form, from, to, applyFilters } = useJurnal7DateRange()

  const { mutate: deletePrixod, isPending: isDeleting } = usePrixodDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast.success('Приход успешно удален')
    },
    onError() {
      toast.error('Ошибка при удалении прихода')
    }
  })
  const { mutate: importPrixod, isPending: isImporting } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.set('file', file)
      const res = await http.post('/jur_7/doc_prixod/import', formData, {
        params: {
          main_schet_id,
          budjet_id
        }
      })
      return res.data
    },
    onSuccess() {
      toast.success('Данные импортированы успешно')
      setFile(undefined)
    },
    onError() {
      toast.error('Не удалось импортировать данные')
    }
  })
  const { data: prixodList, isFetching } = usePrixodList({
    params: {
      ...pagination,
      main_schet_id,
      from,
      to
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.prixod-docs'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setFile(undefined)
      }
      dialogToggle.setOpen(open)
    },
    [setFile, dialogToggle.setOpen]
  )

  return (
    <ListView>
      <div className="p-5 flex items-center justify-between">
        <DateRangeForm
          form={form}
          onSubmit={applyFilters}
        />
        {main_schet_id ? (
          <ButtonGroup>
            <Button onClick={dialogToggle.open}>
              <Import className="btn-icon icon-start" /> {t('import-data')}
            </Button>
            <DownloadFile
              url="/jur_7/doc_prixod/template"
              fileName={`jur7_prixod_shablon-${from}&${to}.xlsx`}
              buttonText={t('download-something', { something: t('template') })}
              params={{}}
            />
            <DownloadFile
              url="jur_7/doc_prixod/report"
              fileName={`jur7_prixod_report-${from}&${to}.xlsx`}
              buttonText={t('download-something', { something: t('report') })}
              params={{ from, to, main_schet_id }}
            />
          </ButtonGroup>
        ) : null}
      </div>
      <ListView.Content
        loading={isFetching || isDeleting}
        className="flex-1 relative"
      >
        <GenericTable
          columnDefs={columns}
          data={prixodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              title: 'Удалить приход?',
              onConfirm: () => deletePrixod(row.id)
            })
          }}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={prixodList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <Dialog
        open={dialogToggle.isOpen}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="pt-10">
          <FileDropzone onUpload={setFile} />
          <div>
            {file ? (
              <div className="flex flex-col gap-1">
                <h6 className="text-xs uppercase font-bold">Выбранный файл</h6>
                <Card className="px-5 py-3 flex items-center gap-2.5">
                  <div className="bg-brand rounded-full size-10 flex items-center justify-center">
                    <File className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{file.name}</p>
                    <p className="text-xs font-bold text-slate-500">
                      {bytesToMegaBytes(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-500 hover:bg-red-50"
                    onClick={() => setFile(undefined)}
                  >
                    <Trash className="btn-icon !mx-0" />
                  </Button>
                </Card>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              disabled={!file}
              onClick={() => {
                importPrixod(file!)
              }}
            >
              {isImporting ? (
                <LoadingSpinner className="mr-2 inline-block size-4 border-white border-2 border-r-transparent" />
              ) : null}
              Отправить
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ListView>
  )
}

export { MO7PrixodPage }
