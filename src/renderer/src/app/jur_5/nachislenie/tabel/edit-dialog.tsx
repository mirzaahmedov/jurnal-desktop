import type { TabelProvodka } from '@/common/models/tabel'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useConfirm } from '@/common/features/confirm'

import { provodkaColumns } from './provodka-columns'
import { TabelService } from './service'

export interface TabelEditDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selectedTabelId?: number
}
export const TabelEditDialog = ({
  selectedTabelId,
  isOpen,
  onOpenChange
}: TabelEditDialogProps) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      children: [] as TabelProvodka[]
    }
  })

  const { data: selectedTabel, isFetching } = useQuery({
    queryKey: [TabelService.QueryKeys.GetById, selectedTabelId!],
    queryFn: TabelService.getById,
    enabled: !!selectedTabelId
  })
  const { mutateAsync: updateTabelProvodka, isPending } = useMutation({
    mutationFn: TabelService.updateChild,
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  useEffect(() => {
    if (selectedTabel) {
      form.reset({
        children: selectedTabel.children
      })
    }
  }, [selectedTabel])

  const handleSubmit = async () => {
    setLoading(true)
    const values = form.getValues('children')
    const results = await Promise.allSettled(
      values.map((child) =>
        updateTabelProvodka({
          id: child.id,
          values: child
        })
      )
    )
    setLoading(false)
    const errors = results.filter((result) => result.status === 'rejected')
    if (errors.length > 0) {
      toast.error(t('update_failed'))
    } else {
      toast.success(t('update_success'))
      onOpenChange?.(false)
    }
  }

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (loading) {
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
        <DialogContent className="w-full max-w-6xl h-full max-h-[600px] px-0">
          <div className="flex flex-col h-full overflow-hidden gap-5 relative">
            {isFetching || isPending ? <LoadingOverlay /> : null}
            <DialogHeader className="px-5">
              <DialogTitle>{t('tabel')}</DialogTitle>
            </DialogHeader>
            <div className="col-span-2 mt-10">
              <EditableTable
                columnDefs={provodkaColumns}
                form={form}
                name="children"
              />
            </div>
            <div className="flex items-center justify-end px-5">
              <Button
                type="button"
                isPending={loading}
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
