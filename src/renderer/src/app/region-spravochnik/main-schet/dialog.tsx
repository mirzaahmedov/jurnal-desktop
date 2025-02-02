import type { MainSchetPayloadType } from './service'
import type { MainSchet } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { budgetService } from '@/app/super-admin/budjet'
import { budgetQueryKeys } from '@/app/super-admin/budjet/constants'
import { SelectField } from '@/common/components'
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

import { mainSchetQueryKeys } from './constants'
import { MainSchetPayloadSchema, mainSchetService } from './service'

export interface MainSchetDialogProps {
  open: boolean
  onChangeOpen: (value: boolean) => void
  selected: MainSchet | null
}
export const MainSchetDialog = (props: MainSchetDialogProps) => {
  const { open, onChangeOpen, selected } = props

  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm<MainSchetPayloadType>({
    defaultValues,
    resolver: zodResolver(MainSchetPayloadSchema)
  })

  const { data: budgets, isFetching: isFetchingBudjets } = useQuery({
    queryKey: [budgetQueryKeys.getAll],
    queryFn: budgetService.getAll
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [mainSchetQueryKeys.create],
    mutationFn: mainSchetService.create,
    onSuccess() {
      toast.success(t('create-success'))
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [mainSchetQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast.success(t('create-failed') + ': ' + error.message)
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [mainSchetQueryKeys.update],
    mutationFn: mainSchetService.update,
    onSuccess() {
      toast.success(t('create-success'))
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [mainSchetQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast.success(t('create-failed') + ': ' + error.message)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (selected) {
      update(Object.assign(payload, { id: selected.id }))
    } else {
      create(payload)
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
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="h-full max-h-[700px] max-w-xl flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selected ? t('edit') : t('create')} {t('main-schet')}
          </DialogTitle>
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
                      <FormLabel className="text-right col-span-2">{t('budjet')}</FormLabel>
                      <SelectField
                        {...field}
                        withFormControl
                        disabled={isFetchingBudjets}
                        triggerClassName="col-span-4"
                        placeholder={t('choose', { what: t('budjet') })}
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

              <FormField
                name="account_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('number')}</FormLabel>
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
                      <FormLabel className="text-right col-span-2">{t('organization')}</FormLabel>
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
                      <FormLabel className="text-right col-span-2">{t('inn')}</FormLabel>
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
                      <FormLabel className="text-right col-span-2">{t('mfo')}</FormLabel>
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
                      <FormLabel className="text-right col-span-2">{t('bank')}</FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 1 })} {t('schet')}
                      </FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 1 })} {t('subschet')}
                      </FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 2 })} {t('schet')}
                      </FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 2 })} {t('subschet')}
                      </FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 3 })} {t('schet')}
                      </FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 3 })} {t('subschet')}
                      </FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 4 })} {t('schet')}
                      </FormLabel>
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
                      <FormLabel className="text-right col-span-2">
                        {t('mo-nth', { nth: 4 })} {t('subschet')}
                      </FormLabel>
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
