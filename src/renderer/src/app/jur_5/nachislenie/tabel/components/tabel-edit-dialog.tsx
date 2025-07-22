import type { TabelDetailsFormValues } from '../interfaces'
import type { TabelProvodka } from '@/common/models/tabel'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
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
}
export const TabelEditDialog = ({
  selectedTabelId,
  isOpen,
  onOpenChange
}: TabelEditDialogProps) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [isLoading, setLoading] = useState(false)

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: { values: [] } as TabelDetailsFormValues
  })

  const { data: selectedTabel, isFetching } = useQuery({
    queryKey: [TabelService.QueryKeys.GetById, selectedTabelId!],
    queryFn: TabelService.getById,
    enabled: !!selectedTabelId
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
        values: selectedTabel
      })
    }
  }, [selectedTabel])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = form.getValues('values')

      const updatedRows: TabelProvodka[] = []
      values.forEach((vacant, rowIndex) => {
        if (!form.formState.dirtyFields.values?.[rowIndex]) {
          return
        }
        vacant.children.forEach((child, childIndex) => {
          if (!form.formState.dirtyFields.values?.[rowIndex]?.children?.[childIndex]) {
            return
          }
          updatedRows.push({
            ...child,
            vacantId: vacant.vacantId,
            vacantName: vacant.vacantName
          } as TabelProvodka)
        })
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
              <CollapsibleTable
                data={form.watch('values')}
                columnDefs={[
                  {
                    key: 'vacantId',
                    header: 'id',
                    width: 160,
                    minWidth: 160
                  },
                  {
                    key: 'vacantName',
                    header: 'vacant'
                  }
                ]}
                getRowId={(row) => row.vacantId}
              >
                {({ rowIndex }) => (
                  <div className="pl-10">
                    <TabelProvodkaEditableTable
                      form={form}
                      rowIndex={rowIndex}
                    />
                  </div>
                )}
              </CollapsibleTable>
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
