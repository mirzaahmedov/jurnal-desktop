import type { Region } from '@/common/models'
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

import { RegionQueryKeys } from './config'
import { RegionFormSchema, type RegionFormValues, RegionService } from './service'

interface RegionDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Region | null
}
export const RegionDialog = ({ isOpen, onOpenChange, selected }: RegionDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm<RegionFormValues>({
    defaultValues,
    resolver: zodResolver(RegionFormSchema)
  })

  const { mutate: createRegion, isPending: isCreating } = useMutation({
    mutationKey: [RegionQueryKeys.create],
    mutationFn: RegionService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [RegionQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateRegion, isPending: isUpdating } = useMutation({
    mutationKey: [RegionQueryKeys.update],
    mutationFn: RegionService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [RegionQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateRegion({
        ...values,
        id: selected.id
      })
    } else {
      createRegion(values)
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
            <DialogTitle className="titlecase">
              {selected ? t('region') : t('create-something', { something: t('region') })}
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
} satisfies RegionFormValues
