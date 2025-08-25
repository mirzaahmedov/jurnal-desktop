import type { Zarplata } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Checkbox } from '@/common/components/jolly/checkbox'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useSpravochnik } from '@/common/features/spravochnik'
import { capitalize } from '@/common/lib/string'

import { ZarplataSpravochnikFormSchema, ZarplataSpravochnikType, defaultValues } from './config'
import { useTypeFilter } from './filters'
import { ZarplataSpravochnikService } from './service'
import { SpravochnikTypeSelect } from './spravochnik-type-select'

const { QueryKeys } = ZarplataSpravochnikService

interface ZarplataSpravochnikDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Zarplata.Spravochnik | undefined
}
export const ZarplataSpravochnikDialog = ({
  isOpen,
  onOpenChange,
  selected
}: ZarplataSpravochnikDialogProps) => {
  const queryClient = useQueryClient()

  const [typeCode] = useTypeFilter()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      typesTypeCode: typeCode ?? defaultValues.typesTypeCode
    },
    resolver: zodResolver(ZarplataSpravochnikFormSchema)
  })

  const { mutate: createSpravochnik, isPending: isCreating } = useMutation({
    mutationKey: [QueryKeys.Create],
    mutationFn: ZarplataSpravochnikService.create,
    onSuccess() {
      toast.success('Справочник создано успешно')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetAll]
      })
      onOpenChange?.(false)
    },
    onError(error) {
      console.error(error)
      toast.error('Не удалось создать справочник: ' + error.message)
    }
  })
  const { mutate: updateSpravochnik, isPending: isUpdating } = useMutation({
    mutationKey: [QueryKeys.Update],
    mutationFn: ZarplataSpravochnikService.update,
    onSuccess() {
      toast.success('Справочник успешно обновлена')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetAll]
      })
      onOpenChange?.(false)
    },
    onError(error) {
      console.error(error)
      toast('Не удалось обновить справочник: ' + error.message)
    }
  })

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
        values
      })
    } else {
      createSpravochnik(values)
    }
  })

  useEffect(() => {
    if (!selected || !isOpen) {
      form.reset({
        ...defaultValues,
        typesTypeCode: typeCode ?? defaultValues.typesTypeCode
      })
      return
    }

    form.reset(selected)
  }, [form, selected, isOpen, typeCode])

  const typeCodeValue = form.watch('typesTypeCode')

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
                  name="typeCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('type_code')}</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

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
                            className="col-span-4 w-full"
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                {typeCodeValue === ZarplataSpravochnikType.Zvanie ? (
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
                              decimalScale={5}
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
                ) : null}

                {/* <FormField
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
                /> */}

                {typeCodeValue === ZarplataSpravochnikType.Doljnost ? (
                  <FormField
                    control={form.control}
                    name="isPoek"
                    render={({ field }) => (
                      <FormElement
                        label={t('poek')}
                        grid="2:4"
                      >
                        <Checkbox
                          isSelected={field.value ?? undefined}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </FormElement>
                    )}
                  />
                ) : null}
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
