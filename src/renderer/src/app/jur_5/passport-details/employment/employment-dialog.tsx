import type { Employment } from '@/common/models/employment'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import { createZarplataSpravochnik } from '@/app/super-admin/zarplata/spravochnik/service'
import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { capitalize } from '@/common/lib/string'

import { EmploymentFormSchema, defaultValues } from './config'
import { EmploymentService } from './service'

export interface EmploymentDialogProps extends Omit<DialogTriggerProps, 'children'> {
  employment?: Employment
  mainZarplataId: number
}
export const EmploymentDialog = ({
  employment,
  mainZarplataId,
  ...props
}: EmploymentDialogProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(EmploymentFormSchema)
  })

  const { mutate: createEmployment, isPending: isCreating } = useMutation({
    mutationFn: EmploymentService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplataId]
      })
      form.reset()
    }
  })
  const { mutate: updateEmployment, isPending: isUpdating } = useMutation({
    mutationFn: EmploymentService.update,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplataId]
      })
      form.reset()
    }
  })

  const zarplataDoljnostSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      title: t('doljnost'),
      value: form.watch('spravochnikZarplataDoljnostId'),
      onChange: (value) => {
        form.setValue('spravochnikZarplataDoljnostId', value ?? 0)
      },
      params: {
        types_type_code: ZarplataSpravochnikType.Doljnost
      }
    })
  )

  useEffect(() => {
    if (employment) {
      form.reset(employment)
    } else {
      form.reset(defaultValues)
    }
  }, [employment])

  const handleSubmit = form.handleSubmit((values) => {
    if (employment) {
      updateEmployment({
        id: employment.id,
        values
      })
    } else {
      createEmployment(values)
    }
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {employment
                ? t('employment')
                : capitalize(t('create-something', { something: t('employment') }))}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t('rayon')}: {form.watch('rayon')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-10"
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-5">
                <FormField
                  control={form.control}
                  name="rayon"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('rayon')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spravochnikZarplataDoljnostId"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('doljnost')}
                    >
                      <SpravochnikInput
                        {...zarplataDoljnostSpravochnik}
                        inputRef={field.ref}
                        getInputValue={(selected) => selected?.name ?? ''}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prikazStart"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('order_start_number')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prikazFinish"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('order_finish_number')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  isPending={isCreating || isUpdating}
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
