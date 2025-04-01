import type { ReportTitle } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
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

import { reportTitleQueryKeys } from './config'
import { ReportTitleFormSchema, type ReportTitleFormValues, reportTitleService } from './service'

interface ReportTitleDialogProps {
  open: boolean
  onChangeOpen: (value: boolean) => void
  selected: ReportTitle | null
}
export const ReportTitleDialog = ({ open, onChangeOpen, selected }: ReportTitleDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const form = useForm<ReportTitleFormValues>({
    defaultValues,
    resolver: zodResolver(ReportTitleFormSchema)
  })

  const { mutate: createReportTitle, isPending: isCreating } = useMutation({
    mutationKey: [reportTitleQueryKeys.create],
    mutationFn: reportTitleService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [reportTitleQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })
  const { mutate: updateReportTitle, isPending: isUpdating } = useMutation({
    mutationKey: [reportTitleQueryKeys.update],
    mutationFn: reportTitleService.update,
    onSuccess(res) {
      toast(res?.message)
      queryClient.invalidateQueries({
        queryKey: [reportTitleQueryKeys.getAll]
      })
      onChangeOpen(false)
    }
  })

  const onSubmit = form.handleSubmit((payload: ReportTitleFormValues) => {
    if (selected) {
      updateReportTitle(Object.assign(payload, { id: selected.id }))
    } else {
      createReportTitle(payload)
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
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('update-something', { something: t('pages.report_title') })
              : t('create-something', { something: t('pages.report_title') })}
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

const defaultValues = {
  name: ''
} satisfies ReportTitleFormValues
