import type { SmetaGrafik } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { monthNames } from '@/common/data/month'
import { useRequisitesStore } from '@/common/features/requisites'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'

import { SmetaGrafikFormSchema, defaultValues, smetaGrafikQueryKeys } from './config'
import { SmetaGrafikService } from './service'

export interface SmetaGrafikDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: null | SmetaGrafik
}
export const SmetaGrafikDialog = ({ isOpen, onOpenChange, selected }: SmetaGrafikDialogProps) => {
  const { t } = useTranslation(['app'])
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(SmetaGrafikFormSchema)
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      value: form.watch('smeta_id'),
      onChange: (value) => {
        // Todo: find more elegant way to deal with this
        form.setValue('smeta_id', value!)
      },
      params: {
        main_schet_id,
        budjet_id
      }
    })
  )

  const { mutate: createSmetaGrafik, isPending: isCreating } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.create],
    mutationFn: SmetaGrafikService.create,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateSmetaGrafik, isPending: isUpdating } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.update],
    mutationFn: SmetaGrafikService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!budjet_id) {
      return
    }
    if (selected) {
      updateSmetaGrafik({
        ...values,
        id: selected.id,
        spravochnik_budjet_name_id: budjet_id
      })
      return
    }
    createSmetaGrafik({
      ...values,
      spravochnik_budjet_name_id: budjet_id!
    })
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
      return
    }
    form.reset(defaultValues)
  }, [form, selected])

  const values = form.watch()
  const summa = useMemo(() => {
    return monthNames.reduce((acc, { name }) => {
      return acc + (values[name] || 0)
    }, 0)
  }, [values])

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="h-full max-h-[700px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('pages.smeta-grafik')
                : t('create-something', { something: t('pages.smeta-grafik') })}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="mt-5 space-y-6 overflow-y-auto noscroll-bar p-1"
            >
              <FormField
                name="year"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label="Год"
                  >
                    <NumericFormat
                      {...field}
                      autoFocus
                      maxLength={4}
                      customInput={Input}
                      value={field.value || ''}
                      onChange={undefined}
                      allowLeadingZeros={false}
                      allowedDecimalSeparators={[]}
                      onValueChange={(values) => field.onChange(values.floatValue)}
                    />
                  </FormElement>
                )}
              />

              <FormElement
                direction="column"
                label="Смета"
              >
                <SpravochnikInput
                  {...smetaSpravochnik}
                  className="col-span-4"
                  getInputValue={(selected) =>
                    `${selected?.smeta_number ?? ''} - ${selected?.smeta_name ?? ''}`
                  }
                />
              </FormElement>

              <div className="grid grid-cols-2 gap-6">
                {monthNames.map(({ name, label }) => (
                  <FormField
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t(label)}
                      >
                        <NumericInput
                          {...field}
                          value={field.value || ''}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                ))}
              </div>
              <DialogFooter className="w-full mt-5 sticky bottom-0 bg-white shadow-[0px_5px_0px_5px_white] flex flex-row !justify-between items-center">
                <h4 className="font-bold text-start">
                  {t('total')}: {formatNumber(roundNumberToTwoDecimalPlaces(summa))}
                </h4>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
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
