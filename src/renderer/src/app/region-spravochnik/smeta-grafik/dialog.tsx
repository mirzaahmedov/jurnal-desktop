import type { SmetaGrafik } from '@/common/models'

import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { monthNames } from '@/common/data/month'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { extendObject, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'

import { SmetaGrafikFormSchema, defaultValues, smetaGrafikQueryKeys } from './constants'
import { smetaGrafikService } from './service'

export interface SmetaGrafikDialogProps {
  open: boolean
  onClose: () => void
  selected: null | SmetaGrafik
}
export const SmetaGrafikDialog = ({ open, onClose, selected }: SmetaGrafikDialogProps) => {
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
    mutationFn: smetaGrafikService.create,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
      onClose()
    }
  })
  const { mutate: updateSmetaGrafik, isPending: isUpdating } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.update],
    mutationFn: smetaGrafikService.update,
    onSuccess(res) {
      toast.success(res?.message)
      onClose()
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (!main_schet_id) {
      toast.error('Выберите счет')
      return
    }
    if (selected) {
      updateSmetaGrafik(
        extendObject(payload, {
          id: selected.id,
          spravochnik_budjet_name_id: budjet_id
        })
      )
      return
    }
    createSmetaGrafik(
      extendObject(payload, {
        spravochnik_budjet_name_id: budjet_id
      })
    )
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
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="h-full max-h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('update-something', { something: t('pages.smeta-grafik') })
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
    </Dialog>
  )
}
