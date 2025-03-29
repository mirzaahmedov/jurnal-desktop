import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { BudgetService, budjetQueryKeys } from '@/app/super-admin/budjet'
import { SelectField } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form'
import { useAuthenticationStore } from '@/common/features/auth'
import { useConfirm } from '@/common/features/confirm'

import { requisitesQueryKeys } from './config'
import { getMainSchetsQuery } from './service'
import { useRequisitesStore } from './store'

export type RequisitesDialogProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
}
export const RequisitesDialog = ({ open, onOpenChange }: RequisitesDialogProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()
  const { user } = useAuthenticationStore()
  const { main_schet_id, setRequisites } = useRequisitesStore()

  const form = useForm({
    defaultValues
  })

  const { data: budjets, isLoading: isLoadingBudget } = useQuery({
    queryKey: [budjetQueryKeys.getAll],
    queryFn: BudgetService.getAll,
    enabled: open
  })
  const { data: schetList, isLoading: isLoadingSchets } = useQuery({
    queryKey: [
      requisitesQueryKeys.getAll,
      {
        budjet_id: form.watch('budjet_id')!,
        region_id: user?.region_id ?? 0
      }
    ],
    queryFn: getMainSchetsQuery,
    enabled: !!form.watch('budjet_id') && !!user?.region_id && open
  })

  const onSubmit = form.handleSubmit((values) => {
    const { main_schet_id, budjet_id } = values

    setRequisites({
      main_schet_id,
      budjet_id,
      user_id: user?.id
    })

    form.reset(values)
    onOpenChange(false)
  })

  const handleClose = (open: boolean) => {
    if (!open && form.formState.isDirty) {
      confirm({
        title: t('unsaved_changes_want_to_exit'),
        onConfirm: () => {
          form.reset({}, { keepDefaultValues: true })
          onOpenChange(false)
        }
      })
      return
    }
    onOpenChange(open)
  }

  useEffect(() => {
    if (!main_schet_id) {
      form.reset({
        budjet_id: 0,
        main_schet_id: 0
      })
    }
  }, [form, main_schet_id])

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="titlecase">{t('choose', { what: t('requisites') })}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="budjet_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('budjet')}</FormLabel>
                  <SelectField
                    {...field}
                    withFormControl
                    disabled={isLoadingBudget}
                    placeholder={t('choose', { what: t('budjet') })}
                    options={Array.isArray(budjets?.data) ? budjets.data : []}
                    getOptionValue={(budget) => budget.id.toString()}
                    getOptionLabel={(budget) => budget.name}
                    value={field.value ? field.value.toString() : ''}
                    onValueChange={(value) => {
                      form.setValue('main_schet_id', 0, {
                        shouldDirty: true,
                        shouldValidate: true
                      })
                      field.onChange(Number(value))
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('budjet_id') && user?.region_id ? (
              <FormField
                control={form.control}
                name="main_schet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('raschet-schet')}</FormLabel>
                    <SelectField
                      {...field}
                      withFormControl
                      disabled={isLoadingSchets}
                      placeholder={t('choose', { what: t('raschet-schet') })}
                      options={Array.isArray(schetList?.data) ? schetList.data : []}
                      getOptionValue={(account) => account.main_schet_id.toString()}
                      getOptionLabel={(account) => account.account_number}
                      value={field.value ? field.value.toString() : ''}
                      onValueChange={(value) => field.onChange(Number(value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <DialogFooter>
              <Button disabled={!form.watch('main_schet_id')}>{t('save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
const defaultValues = {
  budjet_id: useRequisitesStore.getState().budjet_id,
  main_schet_id: useRequisitesStore.getState().main_schet_id
}
