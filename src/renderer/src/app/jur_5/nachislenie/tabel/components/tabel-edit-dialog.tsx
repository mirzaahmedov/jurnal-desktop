import type { TabelDetailsFormValues } from '../interfaces'
import type { TabelProvodka } from '@/common/models/tabel'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useConfirm } from '@/common/features/confirm'

import { TabelService } from '../service'
import { TabelProvodkaEditableTable } from './tabel-provodka-editable-table'

export interface TabelEditDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedTabelId?: number
  selectedVacantId?: number
}
export const TabelEditDialog = ({
  selectedTabelId,
  selectedVacantId,
  isOpen,
  onOpenChange
}: TabelEditDialogProps) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [isLoading, setLoading] = useState(false)

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      children: []
    } as TabelDetailsFormValues
  })

  const { data: selectedTabel, isFetching } = useQuery({
    queryKey: [
      TabelService.QueryKeys.GetById,
      selectedTabelId!,
      {
        vacantId: selectedVacantId!
      }
    ],
    queryFn: TabelService.getById,
    enabled: !!selectedTabelId && !!selectedVacantId && isOpen
  })
  const { mutateAsync: updateTabelProvodka, isPending } = useMutation({
    mutationFn: TabelService.updateChild,
    onSuccess: () => {},
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  useEffect(() => {
    if (selectedTabel) {
      form.reset({
        children: selectedTabel
      })
    }
  }, [selectedTabel])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const children = form.getValues('children')

      const updatedRows: TabelProvodka[] = []
      children.forEach((child, rowIndex) => {
        if (!form.formState.dirtyFields.children?.[rowIndex]) {
          return
        }
        updatedRows.push(child as TabelProvodka)
      })

      const results = await Promise.allSettled(
        updatedRows.map((row) =>
          updateTabelProvodka({
            id: row.id,
            values: row
          })
        )
      )
      const errors = results.filter((result) => result.status === 'rejected')
      if (errors.length > 0) {
        toast.error(t('update_failed'))
      } else {
        toast.success(t('update_success'))
        queryClient.invalidateQueries({
          queryKey: [TabelService.QueryKeys.GetById, selectedTabelId!]
        })
        onOpenChange?.(false)
      }
    } catch (error) {
      console.error('Error updating tabel provodka:', error)
      toast.error(t('update_failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (isLoading) {
          return
        }
        if (!isOpen && form.formState.isDirty) {
          confirm({
            title: t('unsaved_changes_want_to_exit'),
            onConfirm: () => {
              form.reset({}, { keepDefaultValues: true })
              onOpenChange?.(false)
            }
          })
          return
        }
        onOpenChange?.(isOpen)
      }}
    >
      <DialogOverlay>
        <DialogContent className="w-full max-w-8xl h-full max-h-[800px] px-0">
          <div className="flex flex-col h-full overflow-hidden gap-5 relative">
            {isFetching || isPending ? <LoadingOverlay /> : null}
            <DialogHeader className="px-5">
              <DialogTitle>{t('tabel')}</DialogTitle>
            </DialogHeader>
            <div className="col-span-2 overflow-y-auto scrollbar">
              <TabelProvodkaEditableTable form={form} />
            </div>
            <div className="flex items-center justify-end px-5">
              <Button
                type="button"
                isPending={isLoading}
                onClick={handleSubmit}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
