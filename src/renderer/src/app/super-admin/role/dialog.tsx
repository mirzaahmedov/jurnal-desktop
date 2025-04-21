import type { Role } from '@/common/models'

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

import { RoleQueryKeys } from './constants'
import { RoleFormSchema, type RoleFormValues, RoleService } from './service'

type RoleDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: Role | null
}
const RoleDialog = (props: RoleDialogProps) => {
  const { open, onChangeOpen, data } = props

  const { toast } = useToast()
  const { t } = useTranslation()

  const queryClient = useQueryClient()

  const form = useForm<RoleFormValues>({
    defaultValues,
    resolver: zodResolver(RoleFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [RoleQueryKeys.create],
    mutationFn: RoleService.create,
    onSuccess() {
      toast({
        title: 'Роль успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [RoleQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать роль',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [RoleQueryKeys.update],
    mutationFn: RoleService.update,
    onSuccess() {
      toast({
        title: 'Роль успешно обновлена'
      })
      queryClient.invalidateQueries({
        queryKey: [RoleQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить роль',
        description: error.message
      })
    }
  })

  const onSubmit = (payload: RoleFormValues) => {
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
              ? t('update-something', { something: t('role') })
              : t('create-something', { something: t('role') })}
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
} satisfies RoleFormValues

export default RoleDialog
