import type { User } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { roleQueryKeys, roleService } from '@/app/super-admin/role'
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
import { useToast } from '@/common/hooks/use-toast'

import { regionUserKeys } from './constants'
import { RegionUserPayloadSchema, type RegionUserPayloadType, regionUserService } from './service'

type RegionUserDialogProps = {
  isOpen: boolean
  onChangeOpen(value: boolean): void
  selected: User | null
}
const RegionUserDialog = (props: RegionUserDialogProps) => {
  const { isOpen, onChangeOpen, selected } = props

  const { data: roles, isFetching: isFetchingRoles } = useQuery({
    queryKey: [roleQueryKeys.getAll],
    queryFn: roleService.getAll
  })

  const queryClient = useQueryClient()

  const { t } = useTranslation()
  const { toast } = useToast()

  const form = useForm<RegionUserPayloadType>({
    defaultValues,
    resolver: zodResolver(RegionUserPayloadSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [regionUserKeys.create],
    mutationFn: regionUserService.create,
    onSuccess() {
      toast({
        title: 'Пользователь успешно создан'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [regionUserKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать пользователя',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [regionUserKeys.update],
    mutationFn: regionUserService.update,
    onSuccess() {
      toast({
        title: 'Пользователь успешно обновлен'
      })
      queryClient.invalidateQueries({
        queryKey: [regionUserKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить пользователя',
        description: error.message
      })
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      update({
        ...values,
        id: selected.id
      })
    } else {
      create(values)
    }
  })

  useEffect(() => {
    if (!selected) {
      form.reset(defaultValues)
      return
    }

    form.reset(selected)
  }, [form, selected])

  console.log(form.watch())

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onChangeOpen}
    >
      <DialogOverlay>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selected ? 'Изменить' : 'Добавить'} Пользователь</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-4 py-4">
                <FormField
                  name="fio"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">Ф.И.О.</FormLabel>
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
                        <FormLabel className="text-right col-span-2">Логин</FormLabel>
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
                        <FormLabel className="text-right col-span-2">Пароль</FormLabel>
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
                  name="role_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">Роль</FormLabel>
                        <JollySelect
                          isDisabled={isFetchingRoles}
                          buttonRef={field.ref}
                          items={roles?.data ?? []}
                          className="col-span-4"
                          placeholder="Выберите роль"
                          selectedKey={field.value}
                          onSelectionChange={field.onChange}
                        >
                          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
                        </JollySelect>
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
  role_id: 0,
  fio: '',
  login: '',
  password: ''
} satisfies RegionUserPayloadType

export default RegionUserDialog
