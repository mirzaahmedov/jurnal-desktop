import type { PereotsenkaTable } from './config'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { EditableTable } from '@renderer/common/components/editable-table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { groupQueryKeys } from '@/app/super-admin/group/constants'
import { LoadingOverlay } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/common/components/ui/drawer'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { toast } from '@/common/hooks/use-toast'

import { groupColumns } from './columns'
import {
  PereotsenkaBatchForm,
  PereotsenkaBatchFormSchema,
  defaultBatchValues,
  pereotsenkaQueryKeys
} from './config'
import { getLatestPereotsenkaQuery, pereotsenkaCreateBatchQuery } from './service'

type PereotsenkaBatchCreateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}
const PereotsenkaBatchCreateDrawer = (props: PereotsenkaBatchCreateDrawerProps) => {
  const { open, onOpenChange } = props

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
      onOpenChange(false)
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
      onOpenChange={onOpenChange}
    >
      <DrawerContent className="h-[900px] max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle>Добавить переоценку</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="relative h-full flex flex-col overflow-hidden"
          >
            {isFetching ? (
              <LoadingOverlay />
            ) : (
              <>
                <div className="w-full flex flex-row p-5 border-b">
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
                <div className="p-5 overflow-auto scrollbar flex-1">
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
                <DrawerFooter className="flex flex-row justify-start border-t">
                  <Button
                    type="submit"
                    disabled={isPending}
                  >
                    Добавить
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isPending}
                    onClick={onOpenChange.bind(null, false)}
                  >
                    Отмена
                  </Button>
                </DrawerFooter>
              </>
            )}
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

export { PereotsenkaBatchCreateDrawer }
