import type { MainZarplata } from '@/common/models'
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
import { Fieldset, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
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
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { capitalize } from '@/common/lib/string'
import { numberToWords } from '@/common/lib/utils'

import { ZarplataStavkaOptions } from '../../common/data'
import { EmploymentFormSchema, defaultValues } from './config'
import { EmploymentService } from './service'

export interface EmploymentDialogProps extends Omit<DialogTriggerProps, 'children'> {
  employment?: Employment
  mainZarplata: MainZarplata
}
export const EmploymentDialog = ({ employment, mainZarplata, ...props }: EmploymentDialogProps) => {
  const { t, i18n } = useTranslation()

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
        queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplata.id]
      })
      form.reset()
      props?.onOpenChange?.(false)
    }
  })
  const { mutate: updateEmployment, isPending: isUpdating } = useMutation({
    mutationFn: EmploymentService.update,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplata.id]
      })
      form.reset()
      props?.onOpenChange?.(false)
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
      form.reset({
        dateStart: employment.dateStart ? formatDate(parseLocaleDate(employment.dateStart)) : '',
        dateFinish: employment.dateFinish ? formatDate(parseLocaleDate(employment.dateFinish)) : '',
        prikazStart: employment.prikazStart,
        prikazFinish: employment.prikazFinish ?? '',
        rayon: employment.rayon,
        stavka: employment.stavka ?? 0,
        summa: employment.summa ?? 0,
        spravochnikZarplataDoljnostId: employment.spravochnikZarplataDoljnostId ?? 0,
        mainZarplataId: employment.mainZarplataId,
        vacantId: employment.vacantId
      })
    } else {
      form.reset(defaultValues)
    }
  }, [employment])

  const handleSubmit = form.handleSubmit((values) => {
    if (employment) {
      updateEmployment({
        id: employment.id,
        values: {
          ...values,
          dateStart: formatLocaleDate(values.dateStart),
          dateFinish: formatLocaleDate(values.dateFinish),
          mainZarplataId: mainZarplata.id,
          vacantId: mainZarplata.vacantId
        }
      })
    } else {
      createEmployment({
        ...values,
        dateStart: formatLocaleDate(values.dateStart),
        dateFinish: formatLocaleDate(values.dateFinish),
        mainZarplataId: mainZarplata.id,
        vacantId: mainZarplata.vacantId
      })
    }
  })

  useEffect(() => {
    if (props.isOpen) {
      form.setValue('rayon', mainZarplata.rayon)
    }
  }, [form, mainZarplata, props.isOpen])

  console.log({ values: form.formState.errors })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-4xl">
          <div>
            <DialogHeader>
              <DialogTitle>
                {employment
                  ? t('employment')
                  : capitalize(t('create-something', { something: t('employment') }))}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-10"
              >
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
                  <FormField
                    control={form.control}
                    name="rayon"
                    render={({ field }) => (
                      <FormElement
                        label={t('rayon')}
                        direction="column"
                      >
                        <Textarea
                          ref={field.ref}
                          value={field.value}
                          readOnly
                        />
                      </FormElement>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spravochnikZarplataDoljnostId"
                    render={({ field }) => (
                      <FormElement
                        label={t('doljnost')}
                        direction="column"
                      >
                        <SpravochnikInput
                          {...zarplataDoljnostSpravochnik}
                          inputRef={field.ref}
                          getInputValue={(selected) => selected?.name ?? ''}
                        />
                      </FormElement>
                    )}
                  />

                  <div className="col-span-full flex gap-5">
                    <FormField
                      control={form.control}
                      name="stavka"
                      render={({ field }) => (
                        <FormElement
                          label={t('stavka')}
                          direction="column"
                          className="w-32"
                        >
                          <JollySelect
                            items={ZarplataStavkaOptions}
                            selectedKey={field.value}
                            onSelectionChange={field.onChange}
                          >
                            {(item) => <SelectItem id={item.value}>{item.value}</SelectItem>}
                          </JollySelect>
                        </FormElement>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="summa"
                      render={({ field }) => (
                        <FormElement
                          label={t('summa')}
                          direction="column"
                          className="w-full max-w-xs"
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

                  <FormElement
                    label={null}
                    className="col-span-full"
                    divProps={{
                      className: 'gap-0'
                    }}
                  >
                    <Textarea
                      readOnly
                      rows={3}
                      value={numberToWords(form.watch('summa'), i18n.language)}
                    />
                  </FormElement>

                  <Fieldset
                    name={t('order_start')}
                    className="bg-gray-50 rounded-lg border-lg border border-gray-100"
                  >
                    <FormField
                      control={form.control}
                      name="dateStart"
                      render={({ field }) => (
                        <FormElement
                          label={t('date')}
                          direction="column"
                        >
                          <JollyDatePicker
                            ref={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormElement>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prikazStart"
                      render={({ field }) => (
                        <FormElement
                          label={t('number')}
                          direction="column"
                        >
                          <Input {...field} />
                        </FormElement>
                      )}
                    />
                  </Fieldset>
                  <Fieldset
                    name={t('order_finish')}
                    className="bg-gray-50 rounded-lg border-lg border border-gray-100"
                  >
                    <FormField
                      control={form.control}
                      name="dateFinish"
                      render={({ field }) => (
                        <FormElement
                          label={t('date')}
                          direction="column"
                        >
                          <JollyDatePicker
                            ref={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormElement>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prikazFinish"
                      render={({ field }) => (
                        <FormElement
                          label={t('number')}
                          direction="column"
                        >
                          <Input {...field} />
                        </FormElement>
                      )}
                    />
                  </Fieldset>
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
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
