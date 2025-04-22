import type { PereotsenkaTable } from './config'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GroupQueryKeys } from '@/app/super-admin/group/config'
import { LoadingOverlay } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import { FormElement } from '@/common/components/form'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { capitalize } from '@/common/lib/string'

import { GroupColumns } from './columns'
import {
  type PereotsenkaBatchForm,
  PereotsenkaBatchFormSchema,
  PereotsenkaQueryKeys,
  defaultBatchValues
} from './config'
import { getLatestPereotsenkaQuery, pereotsenkaCreateBatchQuery } from './service'

interface PereotsenkaBatchCreateDrawerProps extends Omit<DialogTriggerProps, 'children'> {}
export const PereotsenkaBatchCreateDrawer = ({
  isOpen,
  onOpenChange
}: PereotsenkaBatchCreateDrawerProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm<PereotsenkaTable>({
    defaultValues: defaultBatchValues,
    resolver: zodResolver(PereotsenkaBatchFormSchema)
  })

  const { data: pereotsenkaLatest, isFetching } = useQuery({
    queryKey: [GroupQueryKeys.getLatest],
    queryFn: getLatestPereotsenkaQuery,
    enabled: isOpen
  })

  const { mutate: createBatchPereotsenka, isPending } = useMutation({
    mutationKey: [PereotsenkaQueryKeys.create],
    mutationFn: (values: PereotsenkaBatchForm) => {
      const data = values.array.map((item) => ({
        name: values.name,
        group_jur7_id: item.group_jur7_id,
        pereotsenka_foiz: item.pereotsenka_foiz
      }))
      return pereotsenkaCreateBatchQuery({ data })
    },
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PereotsenkaQueryKeys.getAll]
      })
      form.reset(defaultBatchValues)
      onOpenChange?.(false)
    }
  })

  useEffect(() => {
    if (!Array.isArray(pereotsenkaLatest?.data)) {
      form.reset(defaultBatchValues)
      return
    }
    form.setValue(
      'array',
      pereotsenkaLatest.data.map((group) => ({
        ...group,
        group_jur7_id: group.id
      }))
    )
  }, [form, pereotsenkaLatest])

  const onSubmit = form.handleSubmit((values) => {
    createBatchPereotsenka(values)
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent
          side="bottom"
          className="h-[900px] max-h-[90%]"
        >
          <DialogHeader>
            <DialogTitle className="titlecase">
              {capitalize(t('create-something', { something: t('pereotsenka') }))}
            </DialogTitle>
          </DialogHeader>
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
                          label={t('name')}
                          className="w-full max-w-md"
                        >
                          <Input {...field} />
                        </FormElement>
                      )}
                    />
                  </div>
                  <div className="m-5 relative overflow-auto scrollbar flex-1">
                    <EditableTable
                      columnDefs={
                        GroupColumns as any /* 
                      TODO: fix type error 
                      */
                      }
                      form={form}
                      name="array"
                    />
                  </div>
                  <DialogFooter className="flex flex-row justify-start py-5 border-t">
                    <Button
                      type="submit"
                      disabled={isPending}
                    >
                      {t('add')}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => onOpenChange?.(false)}
                    >
                      {t('close')}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
