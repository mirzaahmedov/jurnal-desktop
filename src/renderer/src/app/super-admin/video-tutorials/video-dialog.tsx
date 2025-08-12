import type { Video } from '@/common/models'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SquarePen, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { VideoPlayer } from '@/common/components/video-player'
import { capitalize } from '@/common/lib/string'
import { cn } from '@/common/lib/utils'

import { videoQueryKeys } from './config'
import { VideoFormSchema, type VideoFormValues, VideoService } from './service'
import { getVideoURL } from './utils'
import { VideoUpload } from './video-upload'

export interface VideoDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  selected: Video | null
  moduleId: number
}
export const VideoDialog = ({ open, onOpenChange, selected, moduleId }: VideoDialogProps) => {
  const queryClient = useQueryClient()

  const [file, setFile] = useState<File | null>(null)
  const [isEditingFile, setEditingFile] = useState(false)

  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues,
    resolver: zodResolver(VideoFormSchema)
  })

  const { mutate: createVideo, isPending: isCreating } = useMutation({
    mutationKey: [videoQueryKeys.create],
    mutationFn: VideoService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [videoQueryKeys.getAll]
      })
      onOpenChange(false)
    }
  })
  const { mutate: updateVideo, isPending: isUpdating } = useMutation({
    mutationKey: [videoQueryKeys.update],
    mutationFn: VideoService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [videoQueryKeys.getAll]
      })
      onOpenChange(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!file) {
      toast.error(t('file_is_required'))
      return
    }

    const formData = new FormData()

    formData.append('file', file)
    formData.append('name', values.name)
    formData.append('sort_order', values.sort_order.toString())
    formData.append('module_id', moduleId.toString())

    if (selected) {
      updateVideo({
        id: selected.id,
        values: formData
      })
    } else {
      createVideo(formData)
    }
  })

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }

    form.reset({
      name: selected.name,
      sort_order: selected.sort_order
    })
  }, [form, selected])

  useEffect(() => {
    if (!open) {
      setFile(null)
      setEditingFile(false)
      form.reset(defaultValues)
    }
  }, [open, onOpenChange, form])

  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selected ? t('video') : capitalize(t('create-something', { something: t('video') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-4 py-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('name')}</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  name="sort_order"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('sort_order')}</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  {selected ? (
                    <div className="text-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setEditingFile((prev) => {
                            if (prev) {
                              setFile(null)
                            }
                            return !prev
                          })
                        }
                        className={cn(isEditingFile && 'gap-1 text-red-500 hover:text-red-500')}
                      >
                        {isEditingFile ? (
                          <X className="btn-icon icon-start" />
                        ) : (
                          <SquarePen className="btn-icon icon-start" />
                        )}
                        {isEditingFile ? t('cancel') : t('edit')}
                      </Button>
                    </div>
                  ) : null}

                  {isEditingFile || !selected ? (
                    <VideoUpload
                      file={file}
                      onSelect={setFile}
                    />
                  ) : (
                    <VideoPlayer
                      src={getVideoURL({ id: selected.id })}
                      title={selected.name}
                    />
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  isPending={isCreating || isUpdating}
                  disabled={isCreating || isUpdating}
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const defaultValues: VideoFormValues = {
  name: '',
  sort_order: 1
}
