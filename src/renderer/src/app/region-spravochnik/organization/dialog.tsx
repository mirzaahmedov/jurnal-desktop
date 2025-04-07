import type { Organization } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

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
import { capitalize } from '@/common/lib/string'

import { defaultValues, organizationQueryKeys } from './config'
import { OrganizationForm } from './organization-form'
import { OrganizationFormSchema, type OrganizationFormValues, organizationService } from './service'

export interface OrganizationDialogProps extends DialogProps {
  selected?: Organization
  state?: {
    original?: OrganizationFormValues
  }
}
export const OrganizationDialog = ({
  open,
  onOpenChange,
  selected,
  state
}: OrganizationDialogProps) => {
  const { t } = useTranslation()

  const original = state?.original

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: original ?? defaultValues,
    resolver: zodResolver(OrganizationFormSchema)
  })

  const { mutate: createOrganization, isPending: isCreatingOrganization } = useMutation({
    mutationKey: [organizationQueryKeys.create],
    mutationFn: organizationService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateOrganization, isPending: isUpdatingOrganization } = useMutation({
    mutationKey: [organizationQueryKeys.update],
    mutationFn: organizationService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getById, selected?.id]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateOrganization({
        id: selected.id,
        ...values
      })
      return
    }
    createOrganization(values)
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
    }
    if (!selected) {
      form.reset(original ?? defaultValues)
      return
    }
    form.reset(selected)
  }, [form, original, selected, open])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl max-h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('organization')
              : capitalize(t('create-something', { something: t('organization') }))}
          </DialogTitle>
        </DialogHeader>
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
                  disabled={isCreatingOrganization || isUpdatingOrganization}
                  type="submit"
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            }
          />
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}
