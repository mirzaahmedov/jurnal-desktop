import type { MainSchet } from '@/common/models'
import type { MainSchetPayloadType } from './service'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/common/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { MainSchetPayloadSchema, mainSchetService } from './service'
import { budgetService } from '@/app/super-admin/budjet'
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
import { SelectField } from '@/common/components'
import { budgetQueryKeys } from '@/app/super-admin/budjet/constants'
import { mainSchetQueryKeys } from './constants'

type OrganizationDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: MainSchet | null
}
const OrganizationDialog = (props: OrganizationDialogProps) => {
  const { open, onChangeOpen, data } = props

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const form = useForm<MainSchetPayloadType>({
    defaultValues,
    resolver: zodResolver(MainSchetPayloadSchema)
  })

  const { data: budgets } = useQuery({
    queryKey: [budgetQueryKeys.getAll],
    queryFn: budgetService.getAll
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [mainSchetQueryKeys.create],
    mutationFn: mainSchetService.create,
    onSuccess() {
      toast({
        title: 'основной счет успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [mainSchetQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать основной счет',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [mainSchetQueryKeys.update],
    mutationFn: mainSchetService.update,
    onSuccess() {
      toast({
        title: 'основной счет успешно обновлена'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [mainSchetQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить основной счет',
        description: error.message
      })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (data) {
      update(Object.assign(payload, { id: data.id }))
    } else {
      create(payload)
    }
  })

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
      <DialogContent className="h-full max-h-[700px] max-w-xl flex flex-col">
        <DialogHeader>
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} основной счет</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="overflow-y-auto noscroll-bar p-1"
          >
            <div className="grid gap-4 py-4">
              <FormField
                name="spravochnik_budjet_name_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Бюджет</FormLabel>
                      <SelectField
                        {...field}
                        withFormControl
                        triggerClassName="col-span-4"
                        placeholder="Выберите бюджет"
                        options={budgets?.data ?? []}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(value) => field.onChange(Number(value))}
                      />
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="account_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Название</FormLabel>
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
                name="account_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Номер</FormLabel>
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
                name="tashkilot_nomi"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Название организации</FormLabel>
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
                name="tashkilot_inn"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">ИНН организации</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="col-span-4"
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="tashkilot_mfo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">МФО организации</FormLabel>
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
                name="tashkilot_bank"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Банк организации</FormLabel>
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
                name="jur1_schet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 1 счет</FormLabel>
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
                name="jur1_subschet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 1 субсчет</FormLabel>
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
                name="jur2_schet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 2 счет</FormLabel>
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
                name="jur2_subschet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 2 субсчет</FormLabel>
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
                name="jur3_schet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 3 счет</FormLabel>
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
                name="jur3_subschet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 3 субсчет</FormLabel>
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
                name="jur4_schet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 4 счет</FormLabel>
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
                name="jur4_subschet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">Журнал 4 субсчет</FormLabel>
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
            <DialogFooter className="w-full mt-5 sticky bottom-0 bg-white shadow-[0px_5px_0px_5px_white]">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {data ? 'Изменить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const defaultValues = {
  spravochnik_budjet_name_id: 0,
  account_name: '',
  account_number: '',
  tashkilot_nomi: '',
  tashkilot_inn: '',
  tashkilot_mfo: '',
  tashkilot_bank: '',
  jur1_schet: '',
  jur1_subschet: '',
  jur2_schet: '',
  jur2_subschet: '',
  jur3_schet: '',
  jur3_subschet: '',
  jur4_schet: '',
  jur4_subschet: ''
} satisfies MainSchetPayloadType

export default OrganizationDialog
