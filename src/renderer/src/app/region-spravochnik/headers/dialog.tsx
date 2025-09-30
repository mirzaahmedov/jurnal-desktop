import type { IHeader } from '@/common/models/headers'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

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
import { Form, FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { capitalize } from '@/common/lib/string'

import { HeadersService } from './service'

interface HeaderDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: IHeader | null
}
export const HeaderDialog = ({ isOpen, onOpenChange, selected }: HeaderDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues
  })

  const { mutate: updatePodrazdelenie, isPending: isUpdating } = useMutation({
    mutationFn: HeadersService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: ['headers/all']
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updatePodrazdelenie({
        ...values,
        id: selected.id
      })
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
                ? t('pages.headers')
                : capitalize(t('create-something', { something: t('pages.headers') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-4 py-4">
                <FormField
                  name="value"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      className="col-span-4"
                      rows={20}
                      {...field}
                    />
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isUpdating}
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
  value: ''
}
