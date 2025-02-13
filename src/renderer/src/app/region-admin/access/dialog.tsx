import type { Dispatch, SetStateAction} from 'react';
import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/common/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { useToast } from '@/common/hooks/use-toast'
import { cn, extendObject } from '@/common/lib/utils'

import { type AccessPayloadType, accessOptions, accessQueryKeys } from './config'
import { accessService } from './service'

export type AccessDialogProps = {
  roleId?: number
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}
const AccessDialog = (props: AccessDialogProps) => {
  const { roleId, open, onOpenChange } = props

  const queryClient = useQueryClient()
  const form = useForm<AccessPayloadType>()

  const { toast } = useToast()

  accessService.forRequest((type, args) => {
    if (type === 'getById') {
      return {
        url: '/auth/access'
      }
    }
    if (type === 'update') {
      const config = args.config
      config.params = extendObject(config.params, {
        role_id: roleId
      })
      return {
        config
      }
    }
    return {}
  })

  const { data: access, isFetching } = useQuery({
    queryKey: [accessQueryKeys.getById, roleId, { role_id: roleId }],
    queryFn: accessService.getById,
    enabled: open
  })

  const { mutate: update, isPending } = useMutation({
    mutationKey: [accessQueryKeys.update],
    mutationFn: accessService.update,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [accessQueryKeys.getById]
      })
      onOpenChange(false)
      toast({
        title: 'Доступ успешно изменен'
      })
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка при изменении доступа',
        description: error.message
      })
    }
  })

  useEffect(() => {
    if (access) {
      form.reset(access.data)
    } else {
      form.reset()
    }
  }, [form, access])

  const onSubmit = form.handleSubmit((payload) => {
    if (!access || !roleId) {
      return
    }
    update({
      id: access.data.id,
      bank: payload.bank,
      kassa: payload.kassa,
      users: payload.users,
      region_users: payload.region_users,
      smeta: payload.smeta,
      role: payload.role,
      region: payload.region,
      spravochnik: payload.spravochnik,
      organization_monitoring: payload.organization_monitoring,
      shartnoma: payload.shartnoma,
      jur3: payload.jur3,
      jur4: payload.jur4,
      jur7: payload.jur7,
      jur152: payload.jur152,
      access: payload.access,
      budjet: payload.budjet,
      podotchet_monitoring: payload.podotchet_monitoring,
      smeta_grafik: payload.smeta_grafik
    })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-screen-md">
        <DialogTitle>Доступ для "{access?.data.role_name}"</DialogTitle>
        <div className="relative">
          {isFetching ? <LoadingOverlay /> : null}
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="columns-2">
                {accessOptions.map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          'flex items-center gap-5 py-3 text-slate-600',
                          field.value === true && 'text-inherit'
                        )}
                      >
                        <Checkbox
                          {...field}
                          value={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormLabel className="!mt-0">{label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isFetching || isPending}
                >
                  Изменить
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { AccessDialog }
