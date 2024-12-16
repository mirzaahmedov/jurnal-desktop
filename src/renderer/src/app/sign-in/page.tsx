import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { SigninFormSchema, defaultValues } from './config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Input } from '@/common/components/ui/input'
import logo from '@resources/logo.svg'
import { signinQuery } from './service'
import { useAuthStore } from '@/common/features/auth'
import { useForm } from 'react-hook-form'
import { useMainSchet } from '@/common/features/main-schet'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useToast } from '@/common/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'

const SigninPage = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { main_schet, setMainSchet } = useMainSchet()
  const { toast } = useToast()
  const { setUser } = useAuthStore()

  const form = useForm({
    resolver: zodResolver(SigninFormSchema),
    defaultValues
  })

  const { mutate: signin, isPending } = useMutation({
    mutationFn: signinQuery,
    onSuccess(res) {
      if (res.data?.result.id !== main_schet?.user_id) {
        setMainSchet()
      }
      setUser({
        token: res.data.token,
        user: res.data.result
      })
      queryClient.clear()
      toast({
        title: 'Вы успешно вошли в систему'
      })
      navigate('/')
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: error.message ?? 'Не удалось войти в систему'
      })
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    signin(values)
  })

  return (
    <main className="h-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center flex-col gap-5">
          <img src={logo} alt="МЧС Республики Узбекистан" className="h-24" />
          <h1 className="max-w-xs text-center text-xl leading-tight font-bold">
            МЧС Республики Узбекистан
          </h1>
        </div>
        <div>
          <Form {...form}>
            <form autoComplete="off" onSubmit={onSubmit} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Логин</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
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
                    <FormLabel>Пароль</FormLabel>
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
                <FormLabel className="!mt-0">Показать пароль</FormLabel>
                <FormMessage />
              </FormItem>
              <Button disabled={isPending} type="submit" className="mt-5">
                Войти
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  )
}

export default SigninPage
