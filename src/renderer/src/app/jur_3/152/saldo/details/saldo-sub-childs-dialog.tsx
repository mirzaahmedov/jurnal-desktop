import type { OrganSaldoFormValues } from '../config'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect, useMemo } from 'react'

import { type UseFormReturn, useWatch } from 'react-hook-form'

import { type EditableColumnDef, EditableTable } from '@/common/components/editable-table'
import { createNumberEditor } from '@/common/components/editable-table/editors'
import { createShartnomaEditor } from '@/common/components/editable-table/editors/shartnoma'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

export interface SaldoSubChildsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  rowIndex?: number
  organName?: string
  form: UseFormReturn<OrganSaldoFormValues>
  isEditable: boolean
}
export const SaldoSubChildsDialog: FC<SaldoSubChildsDialogProps> = ({
  rowIndex,
  organName,
  form,
  isEditable,
  ...props
}) => {
  const columns = useMemo(() => getOrganSaldoSubChildColumns(isEditable), [isEditable])

  const rows = useWatch({
    control: form.control,
    name: `organizations.${rowIndex!}.sub_childs`,
    disabled: !isEditable || rowIndex === undefined
  })
  useEffect(() => {
    const newValues = form.getValues(`organizations.${rowIndex!}.sub_childs`)
    if (rowIndex === undefined || !newValues) {
      return
    }

    const summaPrixod = newValues?.reduce((acc, row) => acc + row.prixod, 0) ?? 0
    const summaRasxod = newValues?.reduce((acc, row) => acc + row.rasxod, 0) ?? 0
    const summaTotal = summaPrixod - summaRasxod

    if (
      summaPrixod === form.getValues(`organizations.${rowIndex}.prixod`) &&
      summaRasxod === form.getValues(`organizations.${rowIndex}.rasxod`)
    ) {
      return
    }

    form.setValue(`organizations.${rowIndex}.prixod`, summaPrixod)
    form.setValue(`organizations.${rowIndex}.rasxod`, summaRasxod)
    form.setValue(`organizations.${rowIndex}.summa`, summaTotal)
  }, [rowIndex, rows])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay
        shouldCloseOnInteractOutside={(element) => !(element as HTMLElement).dataset.tooltip}
      >
        <DialogContent
          className="w-full max-w-5xl h-full max-h-[800px]"
          shouldCloseOnInteractOutside={(element) => !(element as HTMLElement).dataset.tooltip}
        >
          <div className="h-full flex flex-col overflow-hidden gap-5">
            <DialogHeader>
              <DialogTitle>{organName}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto scrollbar">
              {rowIndex !== undefined ? (
                <EditableTable
                  form={form}
                  name={`organizations.${rowIndex}.sub_childs`}
                  columnDefs={columns as any}
                />
              ) : null}
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export const getOrganSaldoSubChildColumns = (
  isEditable: boolean
): EditableColumnDef<OrganSaldoFormValues, 'organizations.1.sub_childs'>[] => [
  {
    key: 'contract_id',
    header: 'shartnoma',
    Editor: createShartnomaEditor({
      key: 'contract_id',
      readOnly: true
    })
  },
  {
    key: 'prixod',
    Editor: createNumberEditor({
      key: 'prixod',
      readOnly: !isEditable,
      inputProps: {
        allowNegative: false
      }
    })
  },
  {
    key: 'rasxod',
    Editor: createNumberEditor({
      key: 'rasxod',
      readOnly: !isEditable,
      inputProps: {
        allowNegative: false
      }
    })
  },
  {
    key: 'summa',
    Editor: createNumberEditor({
      key: 'summa',
      readOnly: true
    })
  }
]
