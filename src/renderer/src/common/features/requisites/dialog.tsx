import type { MainSchet } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { BudjetQueryKeys, BudjetService } from '@/app/super-admin/budjet'
import { FormElement } from '@/common/components/form'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Button } from '@/common/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useAuthenticationStore } from '@/common/features/auth'
import { useConfirm } from '@/common/features/confirm'

import { RequisitesFormSchema, type RequisitesFormValues, useRequisitesStore } from './store'

export type RequisitesDialogProps = {
  isOpen: boolean
  onOpenChange: (value: boolean) => void
}
export const RequisitesDialog = ({ isOpen, onOpenChange }: RequisitesDialogProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()
  const { user } = useAuthenticationStore()

  const setRequisites = useRequisitesStore((store) => store.setRequisites)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(RequisitesFormSchema)
  })

  const { data: budjets, isLoading: isLoadingBudget } = useQuery({
    queryKey: [BudjetQueryKeys.getAll],
    queryFn: BudjetService.getAll,
    enabled: isOpen
  })
  const { data: schets, isLoading: isLoadingSchets } = useQuery({
    queryKey: [
      MainSchetQueryKeys.getAll,
      {
        budjet_id: form.watch('budjet_id')!
      }
    ],
    queryFn: MainSchetService.getAll,
    enabled: !!form.watch('budjet_id') && isOpen
  })

  const { data: mainSchet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, form.watch('main_schet_id')],
    queryFn: MainSchetService.getById,
    enabled: !!form.watch('main_schet_id') && isOpen
  })

  const onSubmit = form.handleSubmit(
    ({ main_schet_id, budjet_id, jur3_schet_152_id, jur3_schet_159_id, jur4_schet_id }) => {
      if (main_schet_id && !jur3_schet_152_id) {
        form.setError('jur3_schet_152_id', {
          type: 'required',
          message: t('required_field')
        })
        return
      }

      if (main_schet_id && !jur3_schet_159_id) {
        form.setError('jur3_schet_159_id', {
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
        jur3_schet_152_id,
        jur3_schet_159_id,
        jur4_schet_id,
        user_id: user?.id
      })

      form.reset({
        budjet_id,
        main_schet_id,
        jur3_schet_152_id,
        jur3_schet_159_id,
        jur4_schet_id
      })
      onOpenChange(false)
    }
  )

  const handleOpenChange = (open: boolean) => {
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
    if (!isOpen) {
      form.reset({
        budjet_id: useRequisitesStore.getState().budjet_id,
        main_schet_id: useRequisitesStore.getState().main_schet_id,
        jur3_schet_152_id: useRequisitesStore.getState().jur3_schet_152_id,
        jur3_schet_159_id: useRequisitesStore.getState().jur3_schet_159_id,
        jur4_schet_id: useRequisitesStore.getState().jur4_schet_id
      })
    }
  }, [isOpen])

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="titlecase">
              {t('choose', { what: t('requisites') })}
            </DialogTitle>
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
                    <JollySelect
                      isDisabled={isLoadingBudget}
                      placeholder={t('budjet')}
                      items={Array.isArray(budjets?.data) ? budjets.data : []}
                      selectedKey={field.value ?? null}
                      onSelectionChange={(value) => {
                        field.onChange(value ?? undefined)

                        form.setValue('main_schet_id', 0, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                        form.setValue('jur3_schet_152_id', 0, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                        form.setValue('jur3_schet_159_id', 0, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                        form.setValue('jur4_schet_id', 0, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                      }}
                    >
                      {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
                    </JollySelect>
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
                      <JollySelect
                        isDisabled={isLoadingSchets}
                        placeholder={t('choose', { what: t('raschet-schet') })}
                        items={Array.isArray(schets?.data) ? schets.data : []}
                        selectedKey={field.value ?? null}
                        onSelectionChange={(value) => {
                          field.onChange(value ?? undefined)

                          const option =
                            schets?.data?.find((item) => item.id === Number(value)) ??
                            ({} as MainSchet)

                          form.setValue(
                            'jur3_schet_152_id',
                            option?.jur3_schets_152?.[0]?.id ?? 0,
                            {
                              shouldDirty: true,
                              shouldValidate: true
                            }
                          )
                          form.setValue(
                            'jur3_schet_159_id',
                            option?.jur3_schets_159?.[0]?.id ?? 0,
                            {
                              shouldDirty: true,
                              shouldValidate: true
                            }
                          )
                          form.setValue('jur4_schet_id', option?.jur4_schets?.[0]?.id ?? 0, {
                            shouldDirty: true,
                            shouldValidate: true
                          })
                        }}
                      >
                        {(item) => <SelectItem id={item.id}>{item.account_number}</SelectItem>}
                      </JollySelect>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              {form.watch('main_schet_id') ? (
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
                      value={mainSchet?.data?.jur1_schet ?? ''}
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
                      value={mainSchet?.data?.jur2_schet ?? ''}
                    />
                  </FormElement>
                  <FormField
                    control={form.control}
                    name="jur3_schet_152_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('mo-nth', { nth: 152 })} {t('schet').toLowerCase()}
                        </FormLabel>
                        <JollySelect
                          placeholder={t('choose', { what: t('schet').toLowerCase() })}
                          items={
                            Array.isArray(mainSchet?.data?.jur3_schets_152)
                              ? mainSchet?.data?.jur3_schets_152
                              : []
                          }
                          selectedKey={field.value ?? ''}
                          onSelectionChange={(value) => field.onChange(value)}
                        >
                          {(item) => <SelectItem id={item.id}>{item.schet}</SelectItem>}
                        </JollySelect>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jur3_schet_159_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('mo-nth', { nth: 159 })} {t('schet').toLowerCase()}
                        </FormLabel>

                        <JollySelect
                          placeholder={t('choose', { what: t('schet').toLowerCase() })}
                          items={
                            Array.isArray(mainSchet?.data?.jur3_schets_159)
                              ? mainSchet?.data?.jur3_schets_159
                              : []
                          }
                          selectedKey={field.value ?? ''}
                          onSelectionChange={(value) => field.onChange(value)}
                        >
                          {(item) => <SelectItem id={item.id}>{item.schet}</SelectItem>}
                        </JollySelect>
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
                        <JollySelect
                          placeholder={t('choose', { what: t('schet').toLowerCase() })}
                          items={
                            Array.isArray(mainSchet?.data?.jur4_schets)
                              ? mainSchet?.data?.jur4_schets
                              : []
                          }
                          selectedKey={field.value ?? ''}
                          onSelectionChange={(value) => field.onChange(value)}
                        >
                          {(item) => <SelectItem id={item.id}>{item.schet}</SelectItem>}
                        </JollySelect>
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
      </DialogOverlay>
    </DialogTrigger>
  )
}
const defaultValues: RequisitesFormValues = {
  budjet_id: useRequisitesStore.getState().budjet_id,
  main_schet_id: useRequisitesStore.getState().main_schet_id,
  jur3_schet_152_id: useRequisitesStore.getState().jur3_schet_152_id,
  jur3_schet_159_id: useRequisitesStore.getState().jur3_schet_159_id,
  jur4_schet_id: useRequisitesStore.getState().jur4_schet_id
}
