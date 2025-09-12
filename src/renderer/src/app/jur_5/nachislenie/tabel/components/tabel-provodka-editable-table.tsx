import type { TabelFormValues } from '../config'
import type { TabelDetailsFormValues } from '../interfaces'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { toast } from 'react-toastify'

import { ZarplataSpravochnikService } from '@/app/super-admin/zarplata/spravochnik/service'
import { Spinner } from '@/common/components'
import { EditableTable, type EditableTableProps } from '@/common/components/editable-table'
import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { useConfirm } from '@/common/features/confirm'

interface CheckboxCellProps {
  isEditable?: boolean
  value: boolean
  doljnostId: number
  onChange: (value: any) => void
}
const CheckboxCell = ({ isEditable = true, value, doljnostId, onChange }: CheckboxCellProps) => {
  const queryClient = useQueryClient()
  const { confirm } = useConfirm()

  const updateMutation = useMutation({
    mutationKey: [ZarplataSpravochnikService.QueryKeys.Update, doljnostId],
    mutationFn: ZarplataSpravochnikService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [ZarplataSpravochnikService.QueryKeys.GetAll]
      })
    },
    onError: (error) => {
      console.log(error)
      toast.error(t('update_failed'))
    }
  })

  const handleCheckedChange = (value: boolean) => {
    confirm({
      title: t('sure_to_update'),
      danger: false,
      onConfirm: () => {
        updateMutation.mutate(
          {
            id: doljnostId,
            values: {
              isPoek: value
            } as any
          },
          {
            onSuccess: (res) => {
              onChange(res.isPoek)
            }
          }
        )
      }
    })
  }

  return updateMutation.isPending ? (
    <Spinner />
  ) : isEditable ? (
    <Checkbox
      isSelected={Boolean(value)}
      isDisabled={updateMutation.isPending}
      onChange={handleCheckedChange}
    />
  ) : (
    <Checkbox isSelected={Boolean(value)} />
  )
}

export const TabelEditableColumnDefs: EditableColumnDef<TabelFormValues, 'tabelChildren'>[] = [
  {
    key: 'fio',
    header: 'employee',
    minWidth: 350,
    Editor: createTextEditor({
      key: 'mainZarplataName',
      readOnly: true
    })
  },
  {
    key: 'doljnost',
    minWidth: 230,
    Editor: createTextEditor({
      key: 'doljnost',
      readOnly: true
    })
  },
  {
    key: 'rabDni',
    header: 'workdays',
    Editor: createNumberEditor({
      key: 'rabDni'
    })
  },

  {
    key: 'otrabDni',
    header: 'worked_days',
    Editor: createNumberEditor({
      key: 'otrabDni'
    })
  },
  {
    key: 'noch',
    header: 'night_shift_hours',
    Editor: createNumberEditor({
      key: 'noch'
    })
  },
  {
    key: 'prazdnik',
    header: 'holiday_hours',
    Editor: createNumberEditor({
      key: 'prazdnik'
    })
  },
  {
    key: 'kazarma',
    header: 'kazarma_hours',
    Editor: createNumberEditor({
      key: 'kazarma'
    })
  },
  {
    key: 'pererabodka',
    header: 'overtime_hours',
    Editor: createNumberEditor({
      key: 'pererabodka'
    })
  },
  {
    key: 'isPoek',
    header: 'poek',
    Editor: ({ row, value, id, form }) => (
      <div className="p-2 grid place-items-center">
        <CheckboxCell
          value={value as boolean}
          doljnostId={row.spravochnikDoljnostId as number}
          onChange={(value) => {
            form.setValue(`tabelChildren.${id}.isPoek`, value)
          }}
        />
      </div>
    )
  }
]

export const TabelProvodkaEditableTable = (
  props: Omit<EditableTableProps<TabelDetailsFormValues, 'children'>, 'columnDefs' | 'name'>
) => {
  return (
    <EditableTable
      columnDefs={TabelEditableColumnDefs as any}
      name="children"
      {...props}
    />
  )
}
