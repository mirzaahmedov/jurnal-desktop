import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/common/components/ui/drawer'
import { OrganizationFormSchema, organizationService } from './service'
import { ScrollArea, ScrollBar } from '@/common/components/ui/scroll-area'
import { useCreateOpen, useParentId } from './hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import { LoadingOverlay } from '@/common/components'
import { Organization } from '@/common/models'
import { OrganizationForm } from './form'
import { OrganizationTable } from './table'
import { defaultValues } from './config'
import { organizationQueryKeys } from './config'
import { toast } from '@/common/hooks'
import { useConfirm } from '@/common/features/confirm'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const UpdateOrganizationDrawer = () => {
  const [parentId, setParentId] = useParentId()
  const [createOpen, setCreateOpen] = useCreateOpen()

  console.log(createOpen)

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(OrganizationFormSchema)
  })

  const { confirm } = useConfirm()

  const {
    data: organization,
    isFetching,
    error
  } = useQuery({
    queryKey: [organizationQueryKeys.getById, Number(parentId)],
    queryFn: organizationService.getById,
    enabled: !!parentId
  })
  const { mutate: updateOrganization, isPending: isUpdating } = useMutation({
    mutationKey: [organizationQueryKeys.update],
    mutationFn: organizationService.update,
    onSuccess() {
      toast({
        title: 'Организация успешно обновлена'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getById, Number(parentId)]
      })
      setParentId(null)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить организацию',
        description: error.message
      })
    }
  })
  const { mutate: deleteOrganization, isPending: isDeleting } = useMutation({
    mutationKey: [organizationQueryKeys.delete],
    mutationFn: organizationService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!parentId) {
      return
    }
    form.reset(organization?.data ?? defaultValues)
  }, [form, organization, parentId])

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось загрузить организацию',
        description: error.message
      })
    }
  }, [error])

  const onSubmit = form.handleSubmit((values) => {
    if (!organization?.data) {
      return
    }
    updateOrganization({
      id: Number(organization?.data?.id),
      ...values
    })
  })

  const handleEdit = (row: Organization) => {
    setParentId(row.id)
  }

  const handleDelete = (row: Organization) => {
    confirm({
      onConfirm() {
        deleteOrganization(row.id)
      }
    })
  }

  return (
    <Drawer open={!!parentId} onOpenChange={() => setParentId(null)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Организация</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-4 relative">
            {isFetching ? <LoadingOverlay /> : null}
            <OrganizationForm
              form={form}
              onSubmit={onSubmit}
              formActions={
                <DrawerFooter>
                  <div className="flex flex-row gap-5">
                    <Button disabled={isFetching || isUpdating} type="submit">
                      Сохранить
                    </Button>
                    <DrawerClose>
                      <Button type="button" variant="outline">
                        Отменить
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              }
            />
          </div>
          <div className="col-span-8 border-l relative">
            {isFetching || isDeleting ? <LoadingOverlay /> : null}
            <ScrollArea type="auto">
              <OrganizationTable
                data={organization?.data.childs ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="p-5 flex flex-row justify-end">
              <Button
                onClick={() => {
                  setCreateOpen(true)
                }}
                disabled={isFetching || isUpdating}
              >
                Добавить
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { UpdateOrganizationDrawer }
