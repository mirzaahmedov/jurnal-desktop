import type { Organization } from '@renderer/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'

import { defaultValues, organizationQueryKeys } from '../config'
import { OrganizationForm } from '../form'
import { OrganizationFormSchema, organizationService } from '../service'

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
