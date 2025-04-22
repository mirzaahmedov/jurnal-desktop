import type { User } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { RegionQueryKeys, RegionService } from '@/app/super-admin/region'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
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

import { AdminUserQueryKeys } from './config'
import { AdminUserFormSchema, type AdmonUserFormValues } from './config'
import { AdminUserService } from './service'

interface AdminUserDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: User | null
}
export const AdminUserDialog = ({ isOpen, onOpenChange, selected }: AdminUserDialogProps) => {
  const { data: regions } = useQuery({
    queryKey: [RegionQueryKeys.getAll],
    queryFn: RegionService.getAll
  })

  const { t } = useTranslation(['user'])

  const queryClient = useQueryClient()

  const form = useForm<AdmonUserFormValues>({
    defaultValues,
    resolver: zodResolver(AdminUserFormSchema)
  })

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationKey: [AdminUserQueryKeys.create],
    mutationFn: AdminUserService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [AdminUserQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationKey: [AdminUserQueryKeys.update],
    mutationFn: AdminUserService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [AdminUserQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateUser({
        ...values,
        id: selected.id
      })
    } else {
      createUser(values)
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
              {selected ? t('user') : capitalize(t('create-something', { something: t('user') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-4 py-4">
                <FormField
                  name="region_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('region')}</FormLabel>
                        <JollySelect
                          placeholder={t('region')}
                          items={regions?.data ?? []}
                          selectedKey={field.value}
                          onSelectionChange={(value) => field.onChange(value ?? 0)}
                          className="col-span-4"
                        >
                          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
                        </JollySelect>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  name="fio"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('fio')}</FormLabel>
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
                  name="login"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('login')}</FormLabel>
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
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('password')}</FormLabel>
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
  region_id: 0,
  fio: '',
  login: '',
  password: ''
} satisfies AdmonUserFormValues
