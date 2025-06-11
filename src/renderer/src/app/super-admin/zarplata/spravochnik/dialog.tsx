import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { ZarplataSpravochnikFormSchema, defaultValues } from './config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import type { DialogTriggerProps } from 'react-aria-components'
import { Input } from '@/common/components/ui/input'
import { NumericInput } from '@/common/components'
import { SpravochnikTypeSelect } from './spravochnik-type-select'
import type { Zarplata } from '@/common/models'
import { ZarplataSpravochnikService } from './service'
import { capitalize } from '@/common/lib/string'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { t } from 'i18next'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const { queryKeys } = ZarplataSpravochnikService

interface ZarplataSpravochnikDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Zarplata.Spravochnik | undefined
}
export const ZarplataSpravochnikDialog = ({
  isOpen,
  onOpenChange,
  selected
}: ZarplataSpravochnikDialogProps) => {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(ZarplataSpravochnikFormSchema)
  })

  const { mutate: createSpravochnik, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: ZarplataSpravochnikService.create,
    onSuccess() {
      toast.success('Справочник создано успешно')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      onOpenChange?.(false)
    },
    onError(error) {
      console.error(error)
      toast.error('Не удалось создать справочник: ' + error.message)
    }
  })
  const { mutate: updateSpravochnik, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update],
    mutationFn: ZarplataSpravochnikService.update,
    onSuccess() {
      toast.success('Справочник успешно обновлена')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      onOpenChange?.(false)
    },
    onError(error) {
      console.error(error)
      toast('Не удалось обновить справочник: ' + error.message)
    }
  })

  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: form.watch('spravochnikOperatsiiId'),
      onChange: (id) => {
        form.setValue('spravochnikOperatsiiId', id ?? 0, { shouldValidate: true })
      }
    })
  )
  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      onChange: (_, smeta) => {
        form.setValue('subSchet', smeta?.smeta_number ?? '', { shouldValidate: true })
      }
    })
  )

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateSpravochnik({
        id: selected.id,
        values: values
      })
    } else {
      createSpravochnik(values)
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
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('spravochnik')
                : capitalize(t('create-something', { something: t('spravochnik') }))}
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
                            onDoubleClick={smetaSpravochnik.open}
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
                            isReadOnly={!!selected}
                            selectedKey={field.value}
                            onSelectionChange={(value) => {
                              field.onChange(value)
                            }}
                            className="col-span-4"
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
                            getInputValue={(o) =>
                              o ? `${o.schet}/${o.sub_schet} - ${o.name}` : ''
                            }
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
      </DialogOverlay>
    </DialogTrigger>
  )
}
