import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@renderer/common/components/ui/drawer'
import {
  OrganizationFormSchema,
  createOrganizationSpravochnik,
  organizationService
} from './service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@renderer/common/components/ui/button'
import { LoadingOverlay } from '@renderer/common/components'
import { Organization } from '@renderer/common/models'
import { OrganizationForm } from './form'
import { OrganizationTable } from './table'
import { defaultValues } from './config'
import { organizationQueryKeys } from './config'
import { toast } from 'react-toastify'
import { useConfirm } from '@renderer/common/features/confirm'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParentId } from './hooks'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

const UpdateOrganizationDrawer = () => {
  const [parentId, setParentId] = useParentId()

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
      toast.success('Организация успешно обновлена')
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getById, Number(parentId)]
      })
      setParentId(null)
    },
    onError(error) {
      toast.error('Не удалось обновить организацию: ' + error.message)
    }
  })

  useEffect(() => {
    if (!parentId) {
      return
    }
    form.reset(organization?.data ?? defaultValues)
  }, [form, organization?.data, parentId])

  useEffect(() => {
    if (error) {
      toast.error('Не удалось загрузить организацию: ' + error.message)
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

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      onChange(_, org) {
        if (!org || !organization?.data) {
          return
        }
        updateOrganization({
          ...org,
          parent_id: organization.data.id
        })
      },
      enabled: !!organization?.data
    })
  )

  const handleEdit = (row: Organization) => {
    setParentId(row.id)
  }

  const handleDelete = (row: Organization) => {
    confirm({
      onConfirm() {
        if (!row || !organization?.data) {
          return
        }
        updateOrganization({
          ...row,
          parent_id: undefined
        })
      }
    })
  }

  const open = !!parentId
  const handleClose = (open: boolean) => {
    if (!open) {
      setParentId(null)
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleClose}
    >
      <DrawerContent className="max-h-full flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Организация</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-12 gap-10 flex-1 overflow-hidden">
          <div className="col-span-4 relative">
            {isFetching ? <LoadingOverlay /> : null}
            <OrganizationForm
              form={form}
              onSubmit={onSubmit}
              formActions={
                <DrawerFooter>
                  <div className="flex flex-row gap-5">
                    <Button
                      disabled={isFetching || isUpdating}
                      type="submit"
                    >
                      Сохранить
                    </Button>
                    <DrawerClose>
                      <Button
                        type="button"
                        variant="outline"
                      >
                        Отменить
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              }
            />
          </div>
          <div className="col-span-8 border-l h-full flex flex-col">
            <div className="relative overflow-auto scrollbar flex-1">
              {isFetching ? <LoadingOverlay /> : null}
              <OrganizationTable
                data={organization?.data.childs ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="p-5 flex flex-row justify-start">
              <Button
                onClick={() => {
                  orgSpravochnik.open()
                }}
                disabled={isFetching || orgSpravochnik.loading || isUpdating}
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
