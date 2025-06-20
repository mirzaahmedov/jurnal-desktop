import type { Position } from '@/common/models'
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

import { PositionQueryKeys } from './config'
import { PositionFormSchema, type PositionFormValues, PositionService } from './service'

interface PositionDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Position | null
}
export const PositionDialog = ({ isOpen, onOpenChange, selected }: PositionDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(PositionFormSchema)
  })

  const { mutate: createPosition, isPending: isCreatingPrixodSchet } = useMutation({
    mutationKey: [PositionQueryKeys.create],
    mutationFn: PositionService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [PositionQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updatePosition, isPending: isUpdating } = useMutation({
    mutationKey: [PositionQueryKeys.update],
    mutationFn: PositionService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [PositionQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updatePosition({
        ...values,
        id: selected.id
      })
    } else {
      createPosition(values)
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
                ? t('pages.position')
                : capitalize(t('create-something', { something: t('pages.position') }))}
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
                  disabled={isCreatingPrixodSchet || isUpdating}
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

const defaultValues: PositionFormValues = {
  name: ''
}
