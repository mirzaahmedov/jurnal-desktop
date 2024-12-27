import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { NumericInput, SpravochnikInput } from '@/common/components'
import { SmetaGrafikFormSchema, defaultValues, smetaGrafikQueryKeys } from './constants'
import { createSpravochnikKeyBindings, useSpravochnik } from '@/common/features/spravochnik'
import { extendObject, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'
import { useEffect, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import { NumericFormat } from 'react-number-format'
import type { SmetaGrafik } from '@/common/models'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { formatNumber } from '@/common/lib/format'
import { monthNames } from '@/common/data/month'
import { smetaGrafikService } from './service'
import { toast } from '@/common/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { useRequisitesStore } from '@/common/features/main-schet'
import { zodResolver } from '@hookform/resolvers/zod'

export type SmetaGrafikDialogProps = {
  open: boolean
  onClose: () => void
  data: null | SmetaGrafik
}
const SmetaGrafikDialog = (props: SmetaGrafikDialogProps) => {
  const { open, onClose, data } = props

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
        form.setValue('smeta_id', value)
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
    onSuccess() {
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
      onClose()
      toast({
        title: 'График сметы успешно создан'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при создании графика сметы',
        description: error.message
      })
    }
  })
  const { mutate: updateSmetaGrafik, isPending: isUpdating } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.update],
    mutationFn: smetaGrafikService.update,
    onSuccess() {
      onClose()
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
      toast({
        title: 'График сметы успешно изменен'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при изменении графика сметы',
        description: error.message
      })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    if (!main_schet_id) {
      toast({
        variant: 'destructive',
        title: 'Выберите счет'
      })
      return
    }
    if (data) {
      updateSmetaGrafik(
        extendObject(payload, {
          id: data.id,
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
    if (data) {
      form.reset(data)
      return
    }
    form.reset(defaultValues)
  }, [form, data])

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
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} график сметы</DialogTitle>
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

            <FormField
              name="smeta_id"
              control={form.control}
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label="Смета"
                >
                  <SpravochnikInput
                    className="col-span-4"
                    {...field}
                    value={`${
                      smetaSpravochnik.selected?.smeta_number ?? ''
                    } - ${smetaSpravochnik.selected?.smeta_name ?? ''}`}
                    ref={smetaSpravochnik.inputRef}
                    onChange={undefined}
                    onKeyDown={createSpravochnikKeyBindings({
                      open: smetaSpravochnik.open,
                      clear: smetaSpravochnik.clear
                    })}
                    onDoubleClick={smetaSpravochnik.open}
                    onClear={smetaSpravochnik.clear}
                  />
                </FormElement>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              {monthNames.map(({ name, label }) => (
                <FormField
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={label}
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
                Сумма: {formatNumber(roundNumberToTwoDecimalPlaces(summa))}
              </h4>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {data ? 'Изменить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SmetaGrafikDialog
