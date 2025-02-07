import { useCallback, useState } from 'react'

import { FileDropzone, LoadingSpinner } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { Card } from '@renderer/common/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@renderer/common/components/ui/dialog'
import { useToggle } from '@renderer/common/hooks'
import { http } from '@renderer/common/lib/http'
import { useMutation } from '@tanstack/react-query'
import { File, Trash, UploadCloud } from 'lucide-react'
import millify from 'millify'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export interface ImportFileDialogProps {
  url: string
  params?: Record<string, unknown>
}
export const ImportFile = ({ url, params }: ImportFileDialogProps) => {
  const dialogToggle = useToggle()

  const [file, setFile] = useState<File>()

  const { t } = useTranslation()

  const { mutate: importFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.set('file', file)
      const res = await http.post(url, formData, {
        params
      })
      return res.data
    },
    onSuccess() {
      toast.success('Данные импортированы успешно')
      setFile(undefined)
      dialogToggle.close()
    },
    onError() {
      toast.error('Не удалось импортировать данные')
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
          <UploadCloud className="btn-icon icon-start" /> {t('import-data')}
        </Button>
      </DialogTrigger>
      <DialogContent className="pt-10">
        <FileDropzone onUpload={setFile} />
        <div>
          {file ? (
            <div className="flex flex-col gap-1">
              <h6 className="text-xs uppercase font-bold">{t('selected-file')}</h6>
              <Card className="px-5 py-3 flex items-center gap-2.5">
                <div className="bg-brand rounded-full size-10 flex items-center justify-center">
                  <File className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{file.name}</p>
                  <p className="text-xs font-bold text-slate-500">
                    {millify(file.size, {
                      space: true,
                      units: ['', 'KB', 'MB', 'GB']
                    })}
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
              importFile(file!)
            }}
          >
            {isPending ? (
              <LoadingSpinner className="mr-2 inline-block size-4 border-white border-2 border-r-transparent" />
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
