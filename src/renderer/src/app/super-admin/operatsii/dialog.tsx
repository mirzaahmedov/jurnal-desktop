import type { OperatsiiForm } from './service'
import type { Operatsii } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

import { operatsiiQueryKeys, operatsiiTypeSchetOptions } from './constants'
import { useOperatsiiFilters } from './filter'
import { OperatsiiFormSchema, operatsiiService } from './service'

type OperatsiiDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: Operatsii | null
}
const OperatsiiDialog = (props: OperatsiiDialogProps) => {
  const { open, onChangeOpen, data } = props

  const { toast } = useToast()
  const { filters } = useOperatsiiFilters()
  const queryClient = useQueryClient()

  const form = useForm<OperatsiiForm>({
    defaultValues,
    resolver: zodResolver(OperatsiiFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
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
  const { mutate: update, isPending: isUpdating } = useMutation({
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

  const onSubmit = (payload: OperatsiiForm) => {
    if (data) {
      update(Object.assign(payload, { id: data.id }))
    } else {
      create(payload)
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
      form.setValue('type_schet', filters.type_schet as TypeSchetOperatsii)
    }
  }, [form, open, filters.type_schet])

  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{data ? 'Изменить' : 'Добавить'} операцию</DialogTitle>
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
                      <FormLabel className="text-right col-span-2">Название</FormLabel>
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
                      <FormLabel className="text-right col-span-2">Счет</FormLabel>
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
                      <FormLabel className="text-right col-span-2">Субсчет</FormLabel>
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
                      <FormLabel className="text-right col-span-2">Тип счета</FormLabel>
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
                      <FormLabel className="text-right col-span-2">Смета</FormLabel>
                      <Input
                        className="col-span-4"
                        {...field}
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
                {data ? 'Изменить' : 'Добавить'}
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
  smeta_id: 0
} satisfies OperatsiiForm

export { OperatsiiDialog }
