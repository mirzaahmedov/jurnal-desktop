import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MainSchetService } from '@/app/region-spravochnik/main-schet'
import { BudgetService, budjetQueryKeys } from '@/app/super-admin/budjet'
import { SelectField } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useAuthenticationStore } from '@/common/features/auth'
import { useConfirm } from '@/common/features/confirm'

import { RequisitesQueryKeys } from './config'
import { RequisitesFormSchema, type RequisitesFormValues, useRequisitesStore } from './store'

export type RequisitesDialogProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
}
export const RequisitesDialog = ({ open, onOpenChange }: RequisitesDialogProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()
  const { user } = useAuthenticationStore()

  const setRequisites = useRequisitesStore((store) => store.setRequisites)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(RequisitesFormSchema)
  })

  const { data: budjets, isLoading: isLoadingBudget } = useQuery({
    queryKey: [budjetQueryKeys.getAll],
    queryFn: BudgetService.getAll,
    enabled: open
  })
  const { data: schets, isLoading: isLoadingSchets } = useQuery({
    queryKey: [
      RequisitesQueryKeys.getAll,
      {
        budjet_id: form.watch('budjet_id')!
      }
    ],
    queryFn: MainSchetService.getAll,
    enabled: !!form.watch('budjet_id') && open
  })

  const { data: mainSchet } = useQuery({
    queryKey: [RequisitesQueryKeys.getMainSchetById, form.watch('main_schet_id')],
    queryFn: MainSchetService.getById,
    enabled: !!form.watch('main_schet_id')
  })

  const onSubmit = form.handleSubmit(
    ({ main_schet_id, budjet_id, jur3_schet_id, jur4_schet_id }) => {
      if (main_schet_id && !jur3_schet_id) {
        form.setError('jur3_schet_id', {
          type: 'required',
          message: t('required_field')
        })
        return
      }

      if (main_schet_id && !jur4_schet_id) {
        form.setError('jur4_schet_id', {
          type: 'required',
          message: t('required_field')
        })
        return
      }

      setRequisites({
        main_schet_id,
        budjet_id,
        jur3_schet_id,
        jur4_schet_id,
        user_id: user?.id
      })

      form.reset({
        budjet_id,
        main_schet_id,
        jur3_schet_id,
        jur4_schet_id
      })
      onOpenChange(false)
    }
  )

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
    if (open) {
      form.reset({
        budjet_id: useRequisitesStore.getState().budjet_id,
        main_schet_id: useRequisitesStore.getState().main_schet_id,
        jur3_schet_id: useRequisitesStore.getState().jur3_schet_id,
        jur4_schet_id: useRequisitesStore.getState().jur4_schet_id
      })
    }
  }, [open])

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
                      options={Array.isArray(schets?.data) ? schets.data : []}
                      getOptionValue={(account) => account.id.toString()}
                      getOptionLabel={(account) => account.account_number}
                      onOptionSelect={(option) => {
                        console.log(option)
                        form.setValue('jur3_schet_id', option?.jur3_schets?.[0]?.id ?? 0, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                        form.setValue('jur4_schet_id', option?.jur4_schets?.[0]?.id ?? 0, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                        field.onChange(Number(option.id))
                      }}
                      value={field.value ? field.value.toString() : ''}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {mainSchet ? (
              <>
                <FormElement
                  direction="column"
                  label={
                    <>
                      {t('mo-nth', { nth: 1 })} {t('schet').toLowerCase()}
                    </>
                  }
                >
                  <Input
                    readOnly
                    value={mainSchet.data?.jur1_schet}
                  />
                </FormElement>
                <FormElement
                  direction="column"
                  label={
                    <>
                      {t('mo-nth', { nth: 2 })} {t('schet').toLowerCase()}
                    </>
                  }
                >
                  <Input
                    readOnly
                    value={mainSchet.data?.jur2_schet}
                  />
                </FormElement>
                <FormField
                  control={form.control}
                  name="jur3_schet_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('mo-nth', { nth: 3 })} {t('schet').toLowerCase()}
                      </FormLabel>
                      <SelectField
                        {...field}
                        withFormControl
                        placeholder={t('choose', { what: t('schet').toLowerCase() })}
                        options={
                          Array.isArray(mainSchet.data?.jur3_schets)
                            ? mainSchet.data?.jur3_schets
                            : []
                        }
                        getOptionValue={(schet) => schet.id}
                        getOptionLabel={(schet) => schet.schet}
                        value={field.value ? field.value.toString() : ''}
                        onValueChange={(value) => field.onChange(Number(value))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jur4_schet_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('mo-nth', { nth: 4 })} {t('schet').toLowerCase()}
                      </FormLabel>
                      <SelectField
                        {...field}
                        withFormControl
                        placeholder={t('choose', { what: t('schet').toLowerCase() })}
                        options={
                          Array.isArray(mainSchet.data?.jur4_schets)
                            ? mainSchet.data?.jur4_schets
                            : []
                        }
                        getOptionValue={(schet) => schet.id}
                        getOptionLabel={(schet) => schet.schet}
                        value={field.value ? field.value.toString() : ''}
                        onValueChange={(value) => field.onChange(Number(value))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            <DialogFooter>
              <Button>{t('save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
const defaultValues: RequisitesFormValues = {
  budjet_id: useRequisitesStore.getState().budjet_id,
  main_schet_id: useRequisitesStore.getState().main_schet_id,
  jur3_schet_id: useRequisitesStore.getState().jur3_schet_id,
  jur4_schet_id: useRequisitesStore.getState().jur4_schet_id
}
