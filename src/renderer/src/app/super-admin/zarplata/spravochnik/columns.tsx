import type { Zarplata } from '@/common/models'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { toast } from 'react-toastify'

import { type ColumnDef, Spinner } from '@/common/components'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { IDCell } from '@/common/components/table/renderers/id'
import { SelectCell } from '@/common/components/table/renderers/select'
import { useConfirm } from '@/common/features/confirm'

import { ZarplataSpravochnikType } from './config'
import { ZarplataSpravochnikService } from './service'

interface CheckboxCellProps {
  isEditable?: boolean
  row: Zarplata.Spravochnik
  field: keyof Zarplata.Spravochnik & string
}
const CheckboxCell = ({ isEditable = true, row, field }: CheckboxCellProps) => {
  const queryClient = useQueryClient()
  const { confirm } = useConfirm()

  const updateMutation = useMutation({
    mutationKey: [ZarplataSpravochnikService.QueryKeys.Update, row.id],
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
        updateMutation.mutate({
          id: row.id,
          values: {
            ...row,
            [field]: value
          }
        })
      }
    })
  }

  return updateMutation.isPending ? (
    <Spinner />
  ) : isEditable ? (
    <Checkbox
      isSelected={Boolean(row[field])}
      isDisabled={updateMutation.isPending}
      onChange={handleCheckedChange}
    />
  ) : (
    <Checkbox isSelected={Boolean(row[field])} />
  )
}

export const ZarplataSpravochnikColumnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'typeCode',
    header: 'type_code',
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    key: 'schet'
  },
  {
    key: 'subSchet',
    header: 'subschet'
  },
  {
    numeric: true,
    key: 'sena1',
    header: 'sena_1'
  },
  {
    numeric: true,
    key: 'sena2',
    header: 'sena_2'
  }
]

export const ZarplataSpravochnikDoljnostColumnDefs: (
  isMutable?: boolean
) => ColumnDef<Zarplata.Spravochnik>[] = (isEditable) => [
  {
    key: 'typeCode',
    header: 'type_code',
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    key: 'isPoek',
    header: 'poek',
    renderCell: (row) => (
      <CheckboxCell
        row={row}
        field="isPoek"
        isEditable={isEditable}
      />
    )
  }
]
export const ZarplataSpravochnikZvanieColumnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'typeCode',
    header: 'type_code',
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    numeric: true,
    key: 'sena1',
    header: 'sena_1'
  },
  {
    numeric: true,
    key: 'sena2',
    header: 'sena_2'
  }
]

export const ZarplataSpravochnikDialogColumnDefs: ColumnDef<Zarplata.Spravochnik>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  }
]

export const getZarplataSpravochnikColumnDefs = (
  typeCode: ZarplataSpravochnikType,
  selectable = false
): ColumnDef<Zarplata.Spravochnik>[] => {
  switch (typeCode) {
    case ZarplataSpravochnikType.Doljnost:
      if (selectable) {
        return [
          {
            key: 'id',
            renderCell: SelectCell
          },
          ...ZarplataSpravochnikDoljnostColumnDefs(false)
        ]
      }
      return ZarplataSpravochnikDoljnostColumnDefs(true)
    default:
      if (selectable) {
        return [
          {
            key: 'id',
            renderCell: SelectCell
          },
          ...ZarplataSpravochnikZvanieColumnDefs
        ]
      }
      return ZarplataSpravochnikZvanieColumnDefs
  }
}
export const getZarplataSpravochnikDialogColumnDefs = (
  typeCode: ZarplataSpravochnikType
): ColumnDef<Zarplata.Spravochnik>[] => {
  switch (typeCode) {
    case ZarplataSpravochnikType.Doljnost:
      return ZarplataSpravochnikDoljnostColumnDefs(false)
    case ZarplataSpravochnikType.Zvanie:
      return ZarplataSpravochnikZvanieColumnDefs
    default:
      return ZarplataSpravochnikDialogColumnDefs
  }
}
