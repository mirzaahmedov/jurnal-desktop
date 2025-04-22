import type { ReportTitle } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { capitalize } from '@/common/lib/string'

import { ReportTitleQueryKeys } from './config'
import { ReportTitleFormSchema, type ReportTitleFormValues, ReportTitleService } from './service'

interface ReportTitleDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: ReportTitle | null
}
export const ReportTitleDialog = ({ isOpen, onOpenChange, selected }: ReportTitleDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const form = useForm<ReportTitleFormValues>({
    defaultValues,
    resolver: zodResolver(ReportTitleFormSchema)
  })

  const { mutate: createReportTitle, isPending: isCreating } = useMutation({
    mutationKey: [ReportTitleQueryKeys.create],
    mutationFn: ReportTitleService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [ReportTitleQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateReportTitle, isPending: isUpdating } = useMutation({
    mutationKey: [ReportTitleQueryKeys.update],
    mutationFn: ReportTitleService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [ReportTitleQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values: ReportTitleFormValues) => {
    if (selected) {
      updateReportTitle({
        ...values,
        id: selected.id
      })
    } else {
      createReportTitle(values)
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
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('pages.report_title')
                : capitalize(t('create-something', { something: t('pages.report_title') }))}
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
      </DialogOverlay>
    </DialogTrigger>
  )
}

const defaultValues = {
  name: ''
} satisfies ReportTitleFormValues
