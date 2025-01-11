import { ArrowRightToLine, Usb } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/common/components/ui/form'
import { SigninFormSchema, defaultValues } from './config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@renderer/common/components/ui/button'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import { Input } from '@renderer/common/components/ui/input'
import { SelectField } from '@renderer/common/components'
import backgroundImage from '@resources/signin-bg.png'
import logoImage from '@resources/logo.svg'
import { signinQuery } from './service'
import { toast } from 'react-toastify'
import { useAuthStore } from '@renderer/common/features/auth'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

const languageOptions = [
  {
    label: 'Русский',
    value: 'ru'
  },
  {
    label: 'O‘zbekcha',
    value: 'uz'
  }
]

const SigninPage = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { user_id, setRequisites } = useRequisitesStore()
  const { setUser } = useAuthStore()

  const form = useForm({
    resolver: zodResolver(SigninFormSchema),
    defaultValues
  })

  const { mutate: signin, isPending } = useMutation({
    mutationFn: signinQuery,
    onSuccess(res) {
      if (res.data?.result.id !== user_id) {
        setRequisites({
          main_schet_id: undefined,
          budjet_id: undefined
        })
      }
      setUser({
        token: res.data.token,
        user: res.data.result
      })
      queryClient.clear()
      toast.success('Вы успешно вошли в систему')
      navigate('/')
    },
    onError(error) {
      toast.error(error.message ?? 'Не удалось войти в систему')
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    signin(values)
  })

  return (
    <main className="h-full flex items-center justify-center">
      <div className="w-full max-w-xl h-full space-y-5 bg-slate-100 py-20 px-16">
        <div className="h-full flex flex-col justify-center gap-5">
          <div className="flex items-center flex-col gap-5">
            <img
              src={logoImage}
              alt="МЧС Республики Узбекистан"
              className="h-48"
            />
            <h1 className="max-w-md text-center text-2xl leading-tight font-bold">
              O‘zbekiston Respublikasi FVV <br />
              axborot tizimi &quot;Е-Moliya&quot;
            </h1>
          </div>
          <div>
            <Form {...form}>
              <form
                autoComplete="off"
                onSubmit={onSubmit}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parol</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type={isPasswordVisible ? 'text' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={isPasswordVisible}
                      onCheckedChange={(state) => setPasswordVisible(!!state)}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Parolni ko‘rsatish</FormLabel>
                  <FormMessage />
                </FormItem>
                <div className="flex flex-col gap-2">
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="mt-5"
                  >
                    <ArrowRightToLine className="btn-icon icon-start" /> Kirish
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                  >
                    <Usb className="btn-icon icon-start" /> USB kalit orqali kirish
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="flex justify-end">
          <SelectField
            defaultValue="uz"
            placeholder="Tilni tanlang"
            options={languageOptions}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            triggerClassName="w-32 bg-white"
          />
        </div>
      </div>
      <div className="flex-1 h-full p-20">
        <img
          aria-hidden
          src={backgroundImage}
          alt="Orqa fon rasmi"
          className="w-full h-full object-contain"
        />
      </div>
    </main>
  )
}

export default SigninPage
