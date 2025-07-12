import type { MainZarplata } from '@/common/models'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'
import type { DialogTriggerProps } from 'react-aria-components'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NumericInput } from '@/common/components'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
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
import { Textarea } from '@/common/components/ui/textarea'

import { FormElement } from '../../../../common/components/form'
import { defaultValues } from './config'
import { OtdelniyRaschetService } from './service'

export interface OtdelniyRaschetDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedRaschet?: OtdelniyRaschet
  mainZarplata: MainZarplata
}
export const OtdelniyRaschetDialog = ({
  mainZarplata,
  selectedRaschet,
  ...props
}: OtdelniyRaschetDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues
  })

  const { mutate: createRaschet, isPending: isCreating } = useMutation({
    mutationFn: OtdelniyRaschetService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      form.reset()
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetAll]
      })
      props?.onOpenChange?.(false)
    }
  })
  const { mutate: updateRaschet, isPending: isUpdating } = useMutation({
    mutationFn: OtdelniyRaschetService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      form.reset()
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetAll]
      })
      props?.onOpenChange?.(false)
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (selectedRaschet) {
      updateRaschet({
        id: selectedRaschet.id,
        values: {
          ...values,
          mainZarplataId: mainZarplata.id,
          vacantId: mainZarplata.vacantId
        }
      })
    } else {
      createRaschet({
        ...values,
        mainZarplataId: mainZarplata.id,
        vacantId: mainZarplata.vacantId
      })
    }
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full h-full max-h-[700px] px-0">
          <div className="flex flex-col h-full overflow-hidden gap-5">
            <DialogHeader className="px-5">
              <DialogTitle>{t('otdelniy_raschet')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={handleSubmit}
                className="p-5 flex-1 flex flex-col min-h-0 overflow-hidden"
              >
                <div className="flex-1 px-5 overflow-y-auto scrollbar">
                  <FormField
                    control={form.control}
                    name="prikazNum"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('order_number')}
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prikazDate"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('order_date')}
                      >
                        <JollyDatePicker {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="opisanie"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('opisanie')}
                      >
                        <Textarea {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="forMonth"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('for_month')}
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="forYear"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('for_year')}
                      >
                        <Input {...field} />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summa"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('summa')}
                      >
                        <NumericInput
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                </div>

                <DialogFooter className="mt-10 border-t pt-5">
                  <Button
                    type="submit"
                    isDisabled={isCreating || isUpdating}
                  >
                    {selectedRaschet ? t('update') : t('create')}
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
