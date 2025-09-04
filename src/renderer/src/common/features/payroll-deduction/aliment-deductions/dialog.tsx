import type { AlimentDeduction } from '@/common/models/payroll-deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createDeductionSpravochnik } from '@/app/jur_5/payment-types/deductions/service'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
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
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import { defaultValues } from './config'
import { AlimentDeductionService } from './service'

export interface AlimentDeductionDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplataId: number
  deductionId: number
  alimentDeductionData?: AlimentDeduction
}
export const AlimentDeductionDialog = ({
  mainZarplataId,
  deductionId,
  alimentDeductionData,
  ...props
}: AlimentDeductionDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: defaultValues
  })

  const deductionSpravochnik = useSpravochnik(
    createDeductionSpravochnik({
      value: form.watch('deductionId'),
      onChange: (value) => form.setValue('deductionId', value ?? 0, { shouldValidate: true })
    })
  )
  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('organizationId'),
      onChange: (value) => form.setValue('organizationId', value ?? 0, { shouldValidate: true })
    })
  )

  const alimentDeductionCreateMutation = useMutation({
    mutationFn: AlimentDeductionService.create,
    onSuccess: () => {
      props?.onOpenChange?.(false)
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [AlimentDeductionService.QueryKeys.GetAll, { mainId: mainZarplataId }]
      })
    }
  })

  const alimentDeductionUpdateMutation = useMutation({
    mutationFn: AlimentDeductionService.update,
    onSuccess: () => {
      props?.onOpenChange?.(false)
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [AlimentDeductionService.QueryKeys.GetAll, { mainId: mainZarplataId }]
      })
    }
  })

  const handleSubmit = () => {
    const values = form.getValues()

    if (alimentDeductionData) {
      alimentDeductionUpdateMutation.mutate({
        id: alimentDeductionData.id,
        values
      })
    } else {
      alimentDeductionCreateMutation.mutate({
        deductionId,
        mainZarplataId,
        cardNumber: values.cardNumber,
        poluchatelFio: values.poluchatelFio,
        organizationId: values.organizationId
      })
    }
  }

  useEffect(() => {
    if (alimentDeductionData) {
      form.reset({
        cardNumber: alimentDeductionData.cardNumber,
        poluchatelFio: alimentDeductionData.poluchatelFio,
        organizationId: alimentDeductionData.organizationId,
        deductionId: alimentDeductionData.deductionId,
        mainZarplataId: alimentDeductionData.mainZarplataId
      })
    } else {
      form.reset(defaultValues)
    }
  }, [alimentDeductionData])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('aliment')}</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={handleSubmit}>
                <div>
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormElement
                        label={t('card_number')}
                        grid="2:4"
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="poluchatelFio"
                    render={({ field }) => (
                      <FormElement
                        label={t('fio')}
                        grid="2:4"
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />
                  <FormElement
                    label={t('organization')}
                    grid="2:4"
                  >
                    <SpravochnikInput
                      {...organSpravochnik}
                      getInputValue={(selected) => selected?.name ?? ''}
                    />
                  </FormElement>
                  <FormElement
                    label={t('deduction')}
                    grid="2:4"
                  >
                    <SpravochnikInput
                      {...deductionSpravochnik}
                      getInputValue={(selected) => selected?.name ?? ''}
                    />
                  </FormElement>
                </div>

                <DialogFooter className="border-t pt-5 mt-5">
                  <Button
                    type="button"
                    onPress={handleSubmit}
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
