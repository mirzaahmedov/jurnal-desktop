import type { OrganSaldoFormValues } from '../../152/saldo/config'
import type { OrganSaldoSubChild } from '@/common/models'
import type { ColDef } from 'ag-grid-community'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useCallback, useMemo } from 'react'

import { Plus } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ShartnomaForm } from '@/app/jur_3/shartnoma/details/shartnoma-form'
import { EditorTable } from '@/common/components/editor-table/editor-table'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useEventCallback, useToggle } from '@/common/hooks'
import { capitalize } from '@/common/lib/string'

import { ShartnomaCellRenderer } from './shartnoma-cell'

export interface OrganSaldoShartnomaDialogProps extends Omit<DialogTriggerProps, 'children'> {
  rowIndex?: number
  organName?: string
  form: UseFormReturn<OrganSaldoFormValues>
  isEditable: boolean
  refetch: () => void
  onChangeTotal: () => void
}
export const OrganSaldoShartnomaDialog: FC<OrganSaldoShartnomaDialogProps> = ({
  rowIndex,
  organName,
  form,
  isEditable,
  refetch,
  onChangeTotal,
  ...props
}) => {
  const { t } = useTranslation()

  const onChangeTotalEvent = useEventCallback(onChangeTotal)

  const onValueEdited = useCallback(
    (childIndex: number, field: keyof OrganSaldoSubChild & string) => {
      if (typeof rowIndex !== 'number') {
        return
      }
      if (field === 'prixod' || field === 'rasxod') {
        const values = form.getValues(`organizations.${rowIndex}.sub_childs.${childIndex}`)
        const prixodValue = Number(values.prixod) || 0
        const rasxodValue = Number(values.rasxod) || 0
        form.setValue(
          `organizations.${rowIndex}.sub_childs.${childIndex}.summa`,
          prixodValue - rasxodValue
        )

        const allValues = form.getValues(`organizations.${rowIndex}.sub_childs`)
        const totalPrixod = allValues.reduce((acc, row) => acc + (Number(row.prixod) || 0), 0)
        const totalRasxod = allValues.reduce((acc, row) => acc + (Number(row.rasxod) || 0), 0)
        form.setValue(`organizations.${rowIndex}.prixod`, totalPrixod)
        form.setValue(`organizations.${rowIndex}.rasxod`, totalRasxod)
        form.setValue(`organizations.${rowIndex}.summa`, totalPrixod - totalRasxod)

        onChangeTotalEvent?.()
      }
    },
    [form, rowIndex, onChangeTotalEvent]
  )

  const columnDefs = useMemo<ColDef<OrganSaldoSubChild>[]>(
    () => [
      {
        field: 'contract_id',
        headerName: t('shartnoma'),
        cellRenderer: ShartnomaCellRenderer
      },
      {
        field: 'prixod',
        headerName: t('prixod'),
        flex: 1,
        minWidth: 200,
        cellRenderer: 'numberEditor',
        cellRendererParams: {
          readOnly: !isEditable,
          allowNegative: false
        }
      },
      {
        field: 'rasxod',
        headerName: t('rasxod'),
        flex: 1,
        minWidth: 200,
        cellRenderer: 'numberEditor',
        cellRendererParams: {
          readOnly: !isEditable,
          allowNegative: false
        }
      },
      {
        field: 'summa',
        headerName: t('summa'),
        flex: 1,
        minWidth: 200,
        cellRenderer: 'numberEditor',
        cellRendererParams: {
          readOnly: true,
          allowNegative: true
        }
      }
    ],
    [isEditable]
  )

  return (
    <>
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
                  <EditorTable
                    form={form}
                    arrayField={`organizations.${rowIndex}.sub_childs`}
                    columnDefs={columnDefs}
                    onValueEdited={onValueEdited}
                  />
                ) : null}
              </div>
              <div>
                <ShartnomaQuickCreateDialog
                  organId={form.watch(`organizations.${rowIndex!}.organization_id`)}
                  refetch={() => {
                    refetch()
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}

const ShartnomaQuickCreateDialog: FC<{
  organId?: number
  refetch: () => void
}> = ({ organId, refetch }) => {
  const { t } = useTranslation()

  const dialogToggle = useToggle()

  return (
    <DialogTrigger
      isOpen={dialogToggle.isOpen}
      onOpenChange={dialogToggle.setOpen}
    >
      <Button IconStart={Plus}>{t('create-something', { something: t('shartnoma') })}</Button>
      <DialogOverlay>
        <DialogContent className="max-w-8xl">
          <DialogHeader>
            <DialogTitle>
              {capitalize(t('create-something', { something: t('shartnoma') }))}
            </DialogTitle>
          </DialogHeader>
          <div className="px-1 w-full overflow-hidden overflow-y-auto scrollbar">
            <ShartnomaForm
              dialog={false}
              organId={organId}
              onSuccess={() => {
                dialogToggle.close()
                refetch()
              }}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
