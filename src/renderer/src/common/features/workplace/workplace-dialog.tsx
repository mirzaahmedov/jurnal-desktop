import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ZarplataStavkaOptions } from '@/app/jur_5/common/data'
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
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Form, FormField } from '@/common/components/ui/form'
import { capitalize } from '@/common/lib/string'
import { getVacantRayon } from '@/common/utils/zarplata'

import { SpravochnikInput, useSpravochnik } from '../spravochnik'
import { WorkplaceFormSchema, type WorkplaceFormValues, defaultValues } from './config'

export interface WorkplaceDialogProps extends Omit<DialogTriggerProps, 'children'> {
  vacant?: VacantTreeNode
  selected: undefined | WorkplaceFormValues
  minimumWage: number
  onSubmit: (values: WorkplaceFormValues) => void
}
export const WorkplaceDialog = ({
  vacant,
  selected,
  minimumWage,
  onSubmit,
  ...props
}: WorkplaceDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(WorkplaceFormSchema)
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
    } else {
      form.reset(defaultValues)
    }
  }, [selected])

  const zarplataSostavSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      title: t('sostav'),
      value: form.watch('spravochnikSostavId'),
      onChange: (value) => {
        form.setValue('spravochnikSostavId', value ?? 0)
      },
      params: {
        types_type_code: ZarplataSpravochnikType.Sostav
      }
    })
  )
  const zarplataDoljnostSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      title: t('doljnost'),
      value: form.watch('spravochnikZarpaltaDoljnostId'),
      onChange: (value) => {
        form.setValue('spravochnikZarpaltaDoljnostId', value ?? 0)
      },
      params: {
        types_type_code: ZarplataSpravochnikType.Doljnost
      }
    })
  )

  const zarplataIstochnikFinanceSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      title: t('source_of_finance'),
      value: form.watch('spravochnikZarplataIstochnikFinanceId'),
      onChange: (value) => {
        form.setValue('spravochnikZarplataIstochnikFinanceId', value ?? 0)
      },
      params: {
        types_type_code: ZarplataSpravochnikType.IstochnikFinans
      }
    })
  )

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values)
    form.reset()
  })

  useEffect(() => {
    if (!selected && vacant) {
      form.setValue('rayon', getVacantRayon(vacant))
    }
  }, [vacant, selected])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('shtatka')
                : capitalize(t('create-something', { something: t('shtatka') }))}
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
                  name="poryadNum"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('numeric-order')}
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
                  name="spravochnikZarpaltaDoljnostId"
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
                  name="setka"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('coefficient')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        decimalScale={undefined}
                        onValueChange={(values) => {
                          const value = values.floatValue ?? 0
                          field.onChange(value)
                          form.setValue('oklad', value * minimumWage)
                          form.setValue('okladPrikaz', value * minimumWage)
                        }}
                      />
                    </FormElement>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="koef"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('razryad')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="oklad"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('oklad')}
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
                  name="prOk"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('pr_ok')}
                    >
                      <JollySelect
                        items={[{ value: 'M' }, { value: 'C' }]}
                        selectedKey={field.value}
                        onSelectionChange={field.onChange}
                        placeholder={t('pr_ok')}
                      >
                        {(item) => <SelectItem id={item.value}>{item.value}</SelectItem>}
                      </JollySelect>
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stavka"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('stavka')}
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
                  name="okladPrikaz"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('prikaz_oklad')}
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
                  name="spravochnikSostavId"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('sostav')}
                    >
                      <SpravochnikInput
                        {...zarplataSostavSpravochnik}
                        inputRef={field.ref}
                        getInputValue={(selected) => selected?.name ?? ''}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spravochnikZarplataIstochnikFinanceId"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('source_of_finance')}
                    >
                      <SpravochnikInput
                        {...zarplataIstochnikFinanceSpravochnik}
                        inputRef={field.ref}
                        getInputValue={(selected) => selected?.name ?? ''}
                      />
                    </FormElement>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">{t('save')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
