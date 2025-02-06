import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { budgetQueryKeys, budgetService } from '@/app/super-admin/budjet'
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

import { queryKeys } from './constants'
import { getMainSchetsQuery } from './service'
import { useRequisitesStore } from './store'

export type RequisitesDialogProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
}
export const RequisitesDialog = (props: RequisitesDialogProps) => {
  const { open, onOpenChange } = props

  const { t } = useTranslation()
  const { user } = useAuthenticationStore()
  const { main_schet_id, budjet_id, setRequisites } = useRequisitesStore()

  const form = useForm({ defaultValues })

  const { data: budgetList, isLoading: isLoadingBudget } = useQuery({
    queryKey: [budgetQueryKeys.getAll],
    queryFn: budgetService.getAll
  })
  const { data: schetList, isLoading: isLoadingSchets } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        budjet_id: form.watch('budjet_id'),
        region_id: user?.region_id ?? 0
      }
    ],
    queryFn: getMainSchetsQuery,
    enabled: !!form.watch('budjet_id') && !!user?.region_id
  })

  const onSubmit = form.handleSubmit((values) => {
    const { main_schet_id, budjet_id } = values

    setRequisites({
      main_schet_id,
      budjet_id,
      user_id: user?.id
    })
    onOpenChange(false)
  })

  useEffect(() => {
    if (open) {
      form.setValue('budjet_id', budjet_id ?? 0)
      form.setValue('main_schet_id', main_schet_id ?? 0)
    }
  }, [form, open, main_schet_id, budjet_id])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
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
                    options={Array.isArray(budgetList?.data) ? budgetList.data : []}
                    getOptionValue={(budget) => budget.id.toString()}
                    getOptionLabel={(budget) => budget.name}
                    value={field.value ? field.value.toString() : ''}
                    onValueChange={(value) => {
                      form.setValue('main_schet_id', 0)
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
              <Button disabled={!form.watch('main_schet_id')}>Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
const defaultValues = {
  budjet_id: 0,
  main_schet_id: 0
}
