import type { DialogProps } from '@radix-ui/react-dialog'
import type { Organization } from '@renderer/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
import { OrganizationForm } from '../organization-form'
import { OrganizationFormSchema, organizationService } from '../service'

type CreateOrganizationDialogProps = DialogProps & {
  state?: {
    original?: Organization
  }
}
const CreateOrganizationDialog = (props: CreateOrganizationDialogProps) => {
  const { open, onOpenChange, state } = props

  const { t } = useTranslation()

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
      <DialogContent className="max-w-2xl max-h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('create-something', { something: t('organization') })}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1 noscroll-bar">
          <ErrorBoundary
            fallback="error"
            onError={(err) => console.log(err)}
          >
            <OrganizationForm
              form={form}
              onSubmit={onSubmit}
              formActions={
                <DialogFooter>
                  <Button
                    disabled={isCreating}
                    type="submit"
                  >
                    {t('add')}
                  </Button>
                </DialogFooter>
              }
            />
          </ErrorBoundary>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CreateOrganizationDialog }
