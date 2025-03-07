import type { Accept } from 'react-dropzone'

import { useCallback, useState } from 'react'

import { FileDropzone, Spinner } from '@renderer/common/components'
import { XlsFile } from '@renderer/common/components/icons/XlsFile'
import { Button } from '@renderer/common/components/ui/button'
import { Card } from '@renderer/common/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@renderer/common/components/ui/dialog'
import { Progress } from '@renderer/common/components/ui/progress'
import { useToggle } from '@renderer/common/hooks'
import { http } from '@renderer/common/lib/http'
import { type MutationOptions, useMutation } from '@tanstack/react-query'
import { CircleX, FolderUp } from 'lucide-react'
import millify from 'millify'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const acceptFiles: Accept = {
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': []
}

export interface ImportFileDialogProps {
  url: string
  params?: Record<string, unknown>
  onSuccess?: (res: unknown) => void
  onError?: MutationOptions<unknown, Error, File>['onError']
}
export const ImportFile = ({ url, params, onSuccess, onError }: ImportFileDialogProps) => {
  const dialogToggle = useToggle()

  const [file, setFile] = useState<File>()
  const [progress, setProgress] = useState<null | number>(null)

  const { t } = useTranslation()

  const { mutate: importFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.set('file', file)
      const res = await http.post(url, formData, {
        params,
        onUploadProgress: (e) => {
          if (!e.total) {
            setProgress(null)
            return
          }
          setProgress((e.loaded / e.total) * 100)
        }
      })
      return res.data
    },
    onSuccess(res) {
      console.log({ res })
      toast.success(res?.message ?? 'Данные импортированы успешно')
      setFile(undefined)
      dialogToggle.close()
      onSuccess?.(res)
    },
    onError(...args) {
      onError?.(...args)
    },
    onSettled() {
      setProgress(null)
    }
  })

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
    <Dialog
      open={dialogToggle.isOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger>
        <Button>
          <FolderUp className="btn-icon icon-start" /> {t('import-excel')}
        </Button>
      </DialogTrigger>
      <DialogContent className="pt-10 w-full max-w-xl">
        <FileDropzone
          onUpload={setFile}
          accept={acceptFiles}
        />
        <div>
          {file ? (
            <div className="flex flex-col gap-1">
              <h6 className="text-xs text-slate-400 uppercase font-bold">{t('selected-file')}</h6>
              <Card className="mt-2 px-5 py-3 flex items-center gap-5">
                <div className="rounded-full size-12 flex items-center justify-center bg-slate-100">
                  <XlsFile />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm break-all text-slate-700">{file.name}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {isPending ? (
                      <div className="flex items-center gap-2.5">
                        <span>{(progress ?? 0).toFixed()}%</span>
                        <Progress value={progress} />
                      </div>
                    ) : (
                      millify(file.size, {
                        space: true,
                        units: ['', 'KB', 'MB', 'GB']
                      })
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-500 hover:bg-red-50"
                  onClick={() => setFile(undefined)}
                >
                  <CircleX className="btn-icon !mx-0" />
                </Button>
              </Card>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button
            disabled={!file}
            onClick={() => {
              importFile(file!)
            }}
          >
            {isPending ? (
              <Spinner className="mr-2 inline-block size-4 border-white border-2 border-r-transparent" />
            ) : null}
            {t('send')}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">{t('cancel')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
