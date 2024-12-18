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
import { OrganizationForm } from './form'
import { toast } from '@/common/hooks'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParentId } from './hooks'
import { zodResolver } from '@hookform/resolvers/zod'

type OrganizationCreateDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
}
const CreateOrganizationDialog = (props: OrganizationCreateDialogProps) => {
  const { open, onChangeOpen } = props

  const [parentId] = useParentId()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(OrganizationFormSchema)
  })

  const { mutate: createOrganization, isPending: isCreating } = useMutation({
    mutationKey: [organizationQueryKeys.create],
    mutationFn: organizationService.create,
    onSuccess() {
      toast({
        title: 'Организация успешно создана'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getById, Number(parentId)]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать организацию',
        description: error.message
      })
    }
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [form])

  const onSubmit = form.handleSubmit((values) => {
    createOrganization({
      ...values,
      parent_id: parentId
    })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
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
