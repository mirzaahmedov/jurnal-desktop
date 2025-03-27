import type { VideoModule } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { capitalize } from '@renderer/common/lib/string'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

import { videoModuleQueryKeys } from './config'
import { VideoModuleFormSchema, type VideoModuleFormValues, VideoModuleService } from './service'

export interface VideoModuleDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  selected: VideoModule | null
}
export const VideoModuleDialog = ({ open, onOpenChange, selected }: VideoModuleDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const form = useForm<VideoModuleFormValues>({
    defaultValues,
    resolver: zodResolver(VideoModuleFormSchema)
  })

  const { mutate: createVideoModule, isPending: isCreating } = useMutation({
    mutationKey: [videoModuleQueryKeys.create],
    mutationFn: VideoModuleService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [videoModuleQueryKeys.getAll]
      })
      onOpenChange(false)
    }
  })
  const { mutate: updateVideoModule, isPending: isUpdating } = useMutation({
    mutationKey: [videoModuleQueryKeys.update],
    mutationFn: VideoModuleService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [videoModuleQueryKeys.getAll]
      })
      onOpenChange(false)
    }
  })

  const onSubmit = form.handleSubmit((payload: VideoModuleFormValues) => {
    if (selected) {
      updateVideoModule(Object.assign(payload, { id: selected.id }))
    } else {
      createVideoModule(payload)
    }
  })

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }

    form.reset(selected)
  }, [form, selected])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? capitalize(t('update-something', { something: t('pages.video_module') }))
              : capitalize(t('create-something', { something: t('pages.video_module') }))}
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
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                loading={isCreating || isUpdating}
              >
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const defaultValues: VideoModuleFormValues = {
  name: ''
}
