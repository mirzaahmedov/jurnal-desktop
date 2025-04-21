import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { cn, extendObject } from '@/common/lib/utils'

import { type RoleAccessFormValues, RoleAccessQueryKeys, roleAccessOptions } from './config'
import { RoleAccessService } from './service'

export interface RoleAccessDialogProps extends Omit<DialogTriggerProps, 'children'> {
  roleId?: number
}
export const RoleAccessDialog = ({ roleId, isOpen, onOpenChange }: RoleAccessDialogProps) => {
  const queryClient = useQueryClient()
  const form = useForm<RoleAccessFormValues>()

  RoleAccessService.forRequest((type, args) => {
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

  const { data: roleAccess, isFetching } = useQuery({
    queryKey: [
      RoleAccessQueryKeys.getById,
      roleId,
      {
        role_id: roleId
      }
    ],
    queryFn: RoleAccessService.getById,
    enabled: isOpen
  })

  const { mutate: update, isPending } = useMutation({
    mutationKey: [RoleAccessQueryKeys.update],
    mutationFn: RoleAccessService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [RoleAccessQueryKeys.getById]
      })
      onOpenChange?.(false)
    }
  })

  useEffect(() => {
    if (roleAccess) {
      form.reset(roleAccess.data)
    } else {
      form.reset({})
    }
  }, [form, roleAccess])

  const onSubmit = form.handleSubmit((values) => {
    if (!roleAccess?.data) {
      return
    }
    update({
      id: roleAccess.data.id,
      kassa: values.kassa,
      bank: values.bank,
      jur3: values.jur3,
      jur4: values.jur4,
      jur5: values.jur5,
      jur7: values.jur7,
      jur8: values.jur8,
      main_book: values.main_book,
      region: values.region,
      spravochnik: values.spravochnik
    })
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-screen-md">
          <DialogTitle>{t('access_rights_for', { role: roleAccess?.data?.role_name })}</DialogTitle>
          <div className="relative">
            {isFetching ? <LoadingOverlay /> : null}
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className="columns-2">
                  {roleAccessOptions.map(({ key, label }) => (
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
                    {t('save')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
