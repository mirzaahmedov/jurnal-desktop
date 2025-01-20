import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { OrganizationFormSchema, organizationService } from '../service'
import { defaultValues, organizationQueryKeys } from '../config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/common/components/ui/button'
import { DialogProps } from '@radix-ui/react-dialog'
import type { Organization } from '@renderer/common/models'
import { OrganizationForm } from '../form'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type CreateOrganizationDialogProps = DialogProps & {
  state?: {
    original?: Organization
  }
}
const CreateOrganizationDialog = (props: CreateOrganizationDialogProps) => {
  const { open, onOpenChange, state } = props

  const original = state?.original

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: original ?? defaultValues,
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

  const onSubmit = form.handleSubmit((values) => {
    createOrganization(values)
  })

  useEffect(() => {
    form.reset(original ?? defaultValues)
  }, [form, original])

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
