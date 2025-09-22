import type { PodotchetSaldoFormValues } from '../config'

import { type FC, memo } from 'react'

import { useTranslation } from 'react-i18next'

import { AgGridTable, type AgGridTableProps } from '@/app/_demo/ag-grid-table'
import { NumberEditor } from '@/app/_demo/components/number-editor'
import { formatNumber } from '@/common/lib/format'

export const PodotchetSaldoTable: FC<AgGridTableProps<PodotchetSaldoFormValues>> = memo(
  ({ form, arrayName, ...props }) => {
    const { t } = useTranslation()
    return (
      <AgGridTable
        form={form}
        arrayName={arrayName}
        columnDefs={[
          {
            flex: 1,
            minWidth: 400,
            field: 'name',
            headerName: t('name')
          },
          {
            width: 300,
            field: 'rayon',
            headerName: t('rayon')
          },
          {
            width: 250,
            field: 'prixod',
            editable: (params) => !params.node.rowPinned && params.context?.isEditable,
            cellEditor: NumberEditor,
            valueFormatter: (params) => formatNumber(params.value)
          },
          {
            width: 250,
            field: 'rasxod',
            editable: (params) => !params.node.rowPinned && params.context?.isEditable,
            cellEditor: NumberEditor,
            valueFormatter: (params) => formatNumber(params.value)
          },
          {
            width: 250,
            field: 'summa',
            valueFormatter: (params) => formatNumber(params.value)
          }
        ]}
        onCellValueChanged={(params) => {
          const { colDef, node } = params
          if (colDef.field === 'prixod' || colDef.field === 'rasxod') {
            const { data } = node
            const prixod = Number(data.prixod) || 0
            const rasxod = Number(data.rasxod) || 0
            form.setValue(`${arrayName}.${params.rowIndex!}.summa`, prixod - rasxod)
            node.setDataValue('summa', prixod - rasxod)
          }
        }}
        context={{
          isEditable: true
        }}
        {...props}
      />
    )
  }
)
