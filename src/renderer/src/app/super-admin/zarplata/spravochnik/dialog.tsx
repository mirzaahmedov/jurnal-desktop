import type { Zarplata } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { NumericInput } from '@renderer/common/components'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import { ZarplataSpravochnikFormSchema, defaultValues } from './config'
import { ZarplataSpravochnikService } from './service'
import { SpravochnikTypeSelect } from './spravochnik-type-select'

const { queryKeys } = ZarplataSpravochnikService

type ZarplataSpravochnikDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  selected: Zarplata.Spravochnik | undefined
}
export const ZarplataSpravochnikDialog = ({
  open,
  onChangeOpen,
  selected
}: ZarplataSpravochnikDialogProps) => {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(ZarplataSpravochnikFormSchema)
  })

  const { mutate: createOperatsii, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: ZarplataSpravochnikService.create,
    onSuccess() {
      toast.success('Справочник создано успешно')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      console.error(error)
      toast.error('Не удалось создать справочник: ' + error.message)
    }
  })
  const { mutate: updateOperatsii, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update],
    mutationFn: ZarplataSpravochnikService.update,
    onSuccess() {
      toast.success('Справочник успешно обновлена')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      console.error(error)
      toast('Не удалось обновить справочник: ' + error.message)
    }
  })

  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: form.watch('spravochnikOperatsiiId'),
      onChange: (id, operatsii) => {
        form.setValue('spravochnikOperatsiiId', id ?? 0, { shouldValidate: true })
        form.setValue('subSchet', operatsii?.sub_schet ?? '', { shouldValidate: true })
      }
    })
  )

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateOperatsii({
        id: selected.id,
        values: values
      })
    } else {
      createOperatsii(values)
    }
  })

  useEffect(() => {
    if (!selected || !open) {
      form.reset(defaultValues)
      return
    }

    form.reset(selected)
  }, [form, selected, open])

  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('update-something', { something: t('spravochnik') })
              : t('create-something', { something: t('spravochnik') })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4 py-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('name')}</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="schet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('schet')}</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="subSchet"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('subschet')}</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="typesTypeCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('type')}</FormLabel>
                      <FormControl>
                        <SpravochnikTypeSelect
                          disabled={!!selected}
                          {...field}
                          triggerClassName="col-span-4 disabled:opacity-100"
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="spravochnikOperatsiiId"
                control={form.control}
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('operatsii')}</FormLabel>
                      <FormControl>
                        <SpravochnikInput
                          readOnly
                          disabled={!!selected}
                          {...operatsiiSpravochnik}
                          getInputValue={(o) => (o ? `${o.schet}/${o.sub_schet} - ${o.name}` : '')}
                          className="disabled:opacity-100"
                          divProps={{
                            className: 'col-span-4'
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="sena1"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('sena_1')}</FormLabel>
                      <FormControl>
                        <NumericInput
                          {...field}
                          className="col-span-4"
                          value={field.value ? field.value : ''}
                          onChange={undefined}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue ?? 0)
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="sena2"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('sena_2')}</FormLabel>
                      <FormControl>
                        <NumericInput
                          {...field}
                          className="col-span-4"
                          value={field.value ? field.value : ''}
                          onChange={undefined}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue ?? 0)
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-end col-span-6" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
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
