import type { ApiResponse, User } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { http } from '@/common/lib/http'

import { useAuthenticationStore } from './store'

export const UpdateProfileDialog = (props: Omit<DialogTriggerProps, 'children'>) => {
  const { t } = useTranslation(['sign-in'])
  const { user, setUser } = useAuthenticationStore()

  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const form = useForm({
    defaultValues: {
      fio: user?.fio || '',
      login: user?.login || '',
      oldPassword: '',
      newPassword: ''
    } as UpdateProfileFormValues,
    resolver: zodResolver(UpdateProfileFormSchema)
  })

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (values: UpdateProfileFormValues) => {
      const res = await http.patch<ApiResponse<[User]>>('auth', values)
      return res.data
    },
    onSuccess: (res) => {
      const user = res?.data?.[0]
      const prevState = useAuthenticationStore.getState()
      if (user && prevState.user) {
        setUser({
          user: {
            ...prevState.user,
            id: user.id,
            fio: user.fio,
            login: user.login
          },
          token: prevState.token
        })
      }
      props?.onOpenChange?.(false)
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    updateProfile(values)
  })

  useEffect(() => {
    if (user) {
      form.reset({
        fio: user.fio || '',
        login: user.login || '',
        oldPassword: '',
        newPassword: ''
      })
    } else {
      form.reset({
        fio: '',
        login: '',
        oldPassword: '',
        newPassword: ''
      })
    }
  }, [form, user])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t('update_profile')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <div className="space-y-6 mt-5">
                <FormField
                  control={form.control}
                  name="fio"
                  render={({ field }) => (
                    <FormElement
                      label={t('fio')}
                      direction="column"
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormElement
                      label={t('login')}
                      direction="column"
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormElement
                      label={t('old-password')}
                      direction="column"
                    >
                      <Input
                        type={isPasswordVisible ? 'text' : 'password'}
                        {...field}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormElement
                      label={t('new-password')}
                      direction="column"
                    >
                      <Input
                        type={isPasswordVisible ? 'text' : 'password'}
                        {...field}
                      />
                    </FormElement>
                  )}
                />
                <FormElement
                  label={t('show-password')}
                  divProps={{
                    className: 'gap-2 flex-row-reverse justify-end'
                  }}
                  innerProps={{
                    className: 'flex-initial w-auto'
                  }}
                >
                  <Checkbox
                    checked={isPasswordVisible}
                    onCheckedChange={(state) => setPasswordVisible(!!state)}
                    className="size-5"
                  />
                </FormElement>
              </div>
            </Form>
            <DialogFooter>
              <Button
                type="submit"
                isPending={isPending}
              >
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const UpdateProfileFormSchema = z.object({
  login: z.string().nonempty(),
  oldPassword: z.string().nonempty(),
  newPassword: z.string().nonempty(),
  fio: z.string().nonempty()
})
type UpdateProfileFormValues = z.infer<typeof UpdateProfileFormSchema>
