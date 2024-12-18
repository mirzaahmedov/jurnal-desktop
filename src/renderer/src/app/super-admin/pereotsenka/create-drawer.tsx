import type { PereotsenkaTable } from './config'

import { useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/common/components/ui/drawer'
import { Form, FormField } from '@/common/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/common/components/ui/input'
import { Button } from '@/common/components/ui/button'
import {
  defaultBatchValues,
  PereotsenkaBatchForm,
  PereotsenkaBatchFormSchema,
  pereotsenkaQueryKeys
} from './config'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormElement } from '@/common/components/form'
import { EditableTable } from '@/common/features/editable-table'

import { pereotsenkaCreateBatchQuery, getLatestPereotsenkaQuery } from './service'
import { groupQueryKeys } from '@/app/super-admin/group/constants'
import { groupColumns } from './columns'
import { LoadingSpinner } from '@/common/components'
import { toast } from '@/common/hooks/use-toast'

type PereotsenkaBatchCreateDrawerProps = {
  open: boolean
  onClose: () => void
}
const PereotsenkaBatchCreateDrawer = (props: PereotsenkaBatchCreateDrawerProps) => {
  const { open, onClose } = props

  const queryClient = useQueryClient()
  const form = useForm<PereotsenkaTable>({
    defaultValues: defaultBatchValues,
    resolver: zodResolver(PereotsenkaBatchFormSchema)
  })

  const { data: pereotsenkaLatest, isFetching } = useQuery({
    queryKey: [groupQueryKeys.getLatest],
    queryFn: getLatestPereotsenkaQuery,
    enabled: open
  })

  const { mutate: createBatchPereotsenka, isPending } = useMutation({
    mutationKey: [pereotsenkaQueryKeys.create],
    mutationFn: (values: PereotsenkaBatchForm) => {
      const data = values.array.map((item) => ({
        name: values.name,
        group_jur7_id: item.group_jur7_id,
        pereotsenka_foiz: item.pereotsenka_foiz
      }))
      return pereotsenkaCreateBatchQuery({ data })
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [pereotsenkaQueryKeys.getAll]
      })
      form.reset(defaultBatchValues)
      onClose()
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка при добавлении переоценки'
      })
      console.error(error)
    }
  })

  useEffect(() => {
    if (!Array.isArray(pereotsenkaLatest?.data)) {
      return
    }
    form.setValue('array', pereotsenkaLatest.data)
  }, [form, pereotsenkaLatest])

  const onSubmit = form.handleSubmit((values) => {
    createBatchPereotsenka(values)
  })

  return (
    <Drawer
      open={open}
      onOpenChange={onClose}
    >
      <DrawerContent className="h-full max-h-[600px]">
        <DrawerHeader>
          <DrawerTitle>Добавить переоценку</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="relative">
              {isFetching ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="w-full flex flex-row p-5">
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormElement
                          label="Название"
                          className="w-full max-w-md"
                        >
                          <Input {...field} />
                        </FormElement>
                      )}
                    />
                  </div>
                  <div className="px-5 mt-5">
                    <EditableTable
                      columns={groupColumns as any}
                      data={form.watch('array')}
                      errors={form.formState.errors.array}
                      onChange={(ctx) => {
                        form.setValue(`array.${ctx.id}`, ctx.payload)
                        form.trigger(`array.${ctx.id}`)
                      }}
                    />
                  </div>
                  <DrawerFooter className="mt-5 flex flex-row justify-start">
                    <Button
                      type="submit"
                      disabled={isPending}
                    >
                      Добавить
                    </Button>
                  </DrawerFooter>
                </>
              )}
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

export { PereotsenkaBatchCreateDrawer as PereotsenkaBatchCreateDialog }
