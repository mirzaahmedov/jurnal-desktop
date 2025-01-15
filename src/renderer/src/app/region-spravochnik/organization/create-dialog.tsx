import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { OrganizationFormSchema, organizationService } from './service'
import { defaultValues, organizationQueryKeys } from './config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import { DialogProps } from '@radix-ui/react-dialog'
import { OrganizationForm } from './form'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const CreateOrganizationDialog = (props: DialogProps) => {
  const { open, onOpenChange } = props

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(OrganizationFormSchema)
  })

  const { mutate: createOrganization, isPending: isCreating } = useMutation({
    mutationKey: [organizationQueryKeys.create],
    mutationFn: organizationService.create,
    onSuccess() {
      toast.success('Организация успешно создана')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getById]
      })
      onOpenChange?.(false)
    },
    onError(error) {
      toast.error('Не удалось создать организацию: ' + error.message)
    }
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [form])

  const onSubmit = form.handleSubmit((values) => {
    createOrganization(values)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Добавить организацию</DialogTitle>
        </DialogHeader>
        <OrganizationForm
          form={form}
          onSubmit={onSubmit}
          formActions={
            <DialogFooter>
              <Button
                disabled={isCreating}
                type="submit"
              >
                Добавить
              </Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

export { CreateOrganizationDialog }
