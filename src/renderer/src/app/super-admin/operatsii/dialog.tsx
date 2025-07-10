import type { OperatsiiFormValues } from './config'
import type { Operatsii } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { toast } from 'react-toastify'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
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
import { useLocationState } from '@/common/hooks/use-location-state'
import { capitalize } from '@/common/lib/string'
import { TypeSchetOperatsii } from '@/common/models'

import { operatsiiQueryKeys, operatsiiTypeSchetOptions } from './config'
import { OperatsiiFormSchema } from './config'
import { OperatsiiService } from './service'

interface OperatsiiDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: Operatsii | null
  original: Partial<OperatsiiFormValues> | null
}
export const OperatsiiDialog = ({
  isOpen,
  onOpenChange,
  selected,
  original
}: OperatsiiDialogProps) => {
  const queryClient = useQueryClient()

  const [typeSchet] = useLocationState('type_schet', TypeSchetOperatsii.KASSA_PRIXOD)
  const [budjet] = useLocationState<number | undefined>('budjet_id', undefined)

  const form = useForm<OperatsiiFormValues>({
    defaultValues,
    resolver: zodResolver(OperatsiiFormSchema)
  })

  const { mutate: createOperatsii, isPending: isCreating } = useMutation({
    mutationKey: [operatsiiQueryKeys.create],
    mutationFn: OperatsiiService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateOperatsii, isPending: isUpdating } = useMutation({
    mutationKey: [operatsiiQueryKeys.update],
    mutationFn: OperatsiiService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      value: form.watch('smeta_id'),
      onChange: (id, smeta) => {
        form.setValue('smeta_id', id, { shouldValidate: true })
        form.setValue('sub_schet', smeta?.smeta_number ?? '', { shouldValidate: true })
      }
    })
  )

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateOperatsii({
        ...values,
        id: selected.id
      })
    } else {
      createOperatsii(values)
    }
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
      return
    }

    if (original) {
      form.reset({
        ...defaultValues,
        ...original
      })
      return
    }

    form.reset(defaultValues)
  }, [form, selected, original])
  useEffect(() => {
    if (isOpen && !selected) {
      if (typeSchet !== TypeSchetOperatsii.ALL) {
        form.setValue('type_schet', typeSchet)
      }
    }
  }, [form, isOpen, typeSchet, budjet, selected])

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
                ? t('operatsii')
                : capitalize(t('create-something', { something: t('operatsii') }))}
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
                  name="schet6"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">
                          {t('schet_6_digit')}
                        </FormLabel>
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
                  name="sub_schet"
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
                  name="type_schet"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('type_schet')}</FormLabel>
                        <JollySelect
                          items={operatsiiTypeSchetOptions.filter(
                            (o) => o.value !== TypeSchetOperatsii.ALL
                          )}
                          selectedKey={field.value}
                          onSelectionChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t('type')}
                          className="col-span-4"
                        >
                          {(item) => (
                            <SelectItem id={item.value}>
                              <Trans
                                ns="app"
                                i18nKey={item.transKey}
                              />
                            </SelectItem>
                          )}
                        </JollySelect>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  name="smeta_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('smeta')}</FormLabel>
                        <Input
                          {...field}
                          readOnly
                          className="col-span-4"
                          value={`${
                            smetaSpravochnik.selected?.smeta_number ?? ''
                          } - ${smetaSpravochnik.selected?.smeta_name ?? ''}`}
                          onChange={undefined}
                          onDoubleClick={smetaSpravochnik.open}
                        />
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

const defaultValues = {
  name: '',
  schet: '',
  schet6: '',
  sub_schet: '',
  type_schet: TypeSchetOperatsii.KASSA_PRIXOD,
  smeta_id: 0
} satisfies OperatsiiFormValues
