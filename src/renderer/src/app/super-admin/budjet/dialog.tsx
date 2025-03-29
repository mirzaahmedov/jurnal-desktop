import type { Budjet } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
import { useToast } from '@/common/hooks/use-toast'

import { budjetQueryKeys } from './constants'
import { BudgetFormSchema, type BudgetFormValues, BudgetService } from './service'

type BudgetDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: Budjet | null
}
const BudgetDialog = (props: BudgetDialogProps) => {
  const { open, onChangeOpen, data } = props

  const { t } = useTranslation()
  const { toast } = useToast()

  const queryClient = useQueryClient()
  const form = useForm<BudgetFormValues>({
    defaultValues,
    resolver: zodResolver(BudgetFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [budjetQueryKeys.create],
    mutationFn: BudgetService.create,
    onSuccess() {
      toast({
        title: 'бюджет успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [budjetQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать бюджет',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [budjetQueryKeys.update],
    mutationFn: BudgetService.update,
    onSuccess() {
      toast({
        title: 'бюджет успешно обновлена'
      })
      queryClient.invalidateQueries({
        queryKey: [budjetQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить бюджет',
        description: error.message
      })
    }
  })

  const onSubmit = (payload: BudgetFormValues) => {
    if (data) {
      update(Object.assign(payload, { id: data.id }))
    } else {
      create(payload)
    }
  }

  useEffect(() => {
    if (!data) {
      form.reset(defaultValues)
      return
    }

    form.reset(data)
  }, [form, data])

  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {data
              ? t('update-something', { something: t('budjet') })
              : t('create-something', { something: t('budjet') })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
} satisfies BudgetFormValues

export default BudgetDialog
