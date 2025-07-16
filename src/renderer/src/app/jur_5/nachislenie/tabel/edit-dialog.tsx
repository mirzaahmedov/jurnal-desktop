import type { TabelProvodka } from '@/common/models/tabel'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useRef } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { provodkaColumns } from './provodka-columns'
import { TabelService } from './service'

export interface TabelEditDialogProps extends Omit<DialogTriggerProps, 'children'> {
  budjetId: number
  mainSchetId: number
  selectedTabelId?: number
}
export const TabelEditDialog = ({ selectedTabelId, ...props }: TabelEditDialogProps) => {
  const { t } = useTranslation(['app'])

  const timeout = useRef<NodeJS.Timeout | null>(null)

  const form = useForm({
    defaultValues: {
      children: [] as TabelProvodka[]
    }
  })
  const children = useWatch({
    control: form.control,
    name: 'children'
  })

  const { data: selectedTabel, isFetching } = useQuery({
    queryKey: [TabelService.QueryKeys.GetById, selectedTabelId!],
    queryFn: TabelService.getById,
    enabled: !!selectedTabelId
  })
  const { mutate: updateTabelProvodka, isPending } = useMutation({
    mutationFn: TabelService.updateChild,
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    if (children?.length > 0) {
      timeout.current = setTimeout(() => {
        const rows = children.filter((_, index) => {
          return !!form.formState.dirtyFields.children?.[index]
        })
        rows.map((row) =>
          updateTabelProvodka({
            id: row.id,
            values: row
          })
        )
      }, 1000)
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [children, form])

  useEffect(() => {
    if (selectedTabel) {
      form.reset({
        children: selectedTabel.children
      })
    }
  }, [selectedTabel])

  return (
    <DialogTrigger {...props}>
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
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
