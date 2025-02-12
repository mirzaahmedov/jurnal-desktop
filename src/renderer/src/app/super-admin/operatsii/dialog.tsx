import type { OperatsiiForm } from './service'
import type { Operatsii } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useForm } from 'react-hook-form'

import { SelectField } from '@/common/components'
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
import { useSpravochnik } from '@/common/features/spravochnik'
import { useToast } from '@/common/hooks/use-toast'
import { TypeSchetOperatsii } from '@/common/models'

import { createBudjetSpravochnik } from '../budjet'
import { operatsiiQueryKeys, operatsiiTypeSchetOptions } from './config'
import { OperatsiiFormSchema, operatsiiService } from './service'

type OperatsiiDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: Operatsii | null
}
const OperatsiiDialog = ({ open, onChangeOpen, data }: OperatsiiDialogProps) => {
  const queryClient = useQueryClient()

  const [typeSchet] = useLocationState('type_schet', TypeSchetOperatsii.KASSA_PRIXOD)
  const [budjet] = useLocationState<number | undefined>('budjet_id', undefined)

  const { toast } = useToast()

  const form = useForm<OperatsiiForm>({
    defaultValues,
    resolver: zodResolver(OperatsiiFormSchema)
  })

  const { mutate: createOperatsii, isPending: isCreating } = useMutation({
    mutationKey: [operatsiiQueryKeys.create],
    mutationFn: operatsiiService.create,
    onSuccess() {
      toast({
        title: 'Операция успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать операцию',
        description: error.message
      })
    }
  })
  const { mutate: updateOperatsii, isPending: isUpdating } = useMutation({
    mutationKey: [operatsiiQueryKeys.update],
    mutationFn: operatsiiService.update,
    onSuccess() {
      toast({
        title: 'Операция успешно обновлена'
      })
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить операцию',
        description: error.message
      })
    }
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      value: form.watch('smeta_id'),
      onChange: (id, smeta) => {
        form.setValue('smeta_id', id)
        form.setValue('sub_schet', smeta?.smeta_number ?? '')
      }
    })
  )
  const budjetSpravochnik = useSpravochnik(
    createBudjetSpravochnik({
      value: form.watch('budjet_id'),
      onChange: (id) => {
        form.setValue('budjet_id', id ?? 0)
      }
    })
  )

  const onSubmit = (payload: OperatsiiForm) => {
    if (data) {
      updateOperatsii(Object.assign(payload, { id: data.id }))
    } else {
      createOperatsii(payload)
    }
  }

  useEffect(() => {
    if (!data) {
      form.reset(defaultValues)
      return
    }

    form.reset(data)
  }, [form, data])
  useEffect(() => {
    if (open) {
      form.setValue('type_schet', typeSchet)
      form.setValue('budjet_id', budjet ?? 0)
    }
  }, [form, open, typeSchet, budjet])

  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {data
              ? t('update-something', { something: t('operatsii') })
              : t('create-something', { something: t('operatsii') })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <SelectField
                        {...field}
                        withFormControl
                        options={operatsiiTypeSchetOptions}
                        placeholder="Выберите тип операции"
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        triggerClassName="col-span-4"
                        onValueChange={(value) => field.onChange(value)}
                      />
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
              <FormField
                name="budjet_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                      <FormLabel className="text-right col-span-2">{t('budjet')}</FormLabel>
                      <Input
                        {...field}
                        readOnly
                        className="col-span-4"
                        value={`${
                          budjetSpravochnik.selected?.name ?? ''
                        } - ${budjetSpravochnik.selected?.name ?? ''}`}
                        onChange={undefined}
                        onDoubleClick={budjetSpravochnik.open}
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
    </Dialog>
  )
}

const defaultValues = {
  name: '',
  schet: '',
  sub_schet: '',
  type_schet: TypeSchetOperatsii.KASSA_PRIXOD,
  smeta_id: 0,
  budjet_id: 0
} satisfies OperatsiiForm

export { OperatsiiDialog }
