import type { AlimentDeduction } from '@/common/models/payroll-deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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

  const form = useForm({
    defaultValues: defaultValues
  })

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('organizationId'),
      onChange: (value) => form.setValue('organizationId', value ?? 0, { shouldValidate: true })
    })
  )

  const alimentDeductionCreateMutation = useMutation({
    mutationFn: AlimentDeductionService.create
  })

  const alimentDeductionUpdateMutation = useMutation({
    mutationFn: AlimentDeductionService.update
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
