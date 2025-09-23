import type { PodotchetSaldoFormValues } from '../config'
import type { FC } from 'react'

import { useTranslation } from 'react-i18next'

import { AgGridTable, type AgGridTableProps, TextFilterComponent } from '@/app/_demo/ag-grid-table'
import { NumberEditor } from '@/app/_demo/components/number-editor'
import { formatNumber } from '@/common/lib/format'

export const PodotchetSaldoTable: FC<AgGridTableProps<PodotchetSaldoFormValues>> = ({
  form,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <AgGridTable
      form={form}
      columnDefs={[
        {
          field: 'rowIndex',
          headerName: ' ',
          width: 80,
          valueGetter: (params) => {
            if (params.node?.rowPinned) {
              return ''
            }
            return (params.node?.rowIndex ?? 0) + 1
          }
        },
        {
          flex: 1,
          minWidth: 400,
          field: 'name',
          sortable: true,
          filter: {
            component: TextFilterComponent,
            doesFilterPass: ({ model, node }) => {
              if (!model) {
                return true
              }
              const data = node.data as { name: string }
              return data?.name?.toLowerCase().includes(model.toLowerCase())
            }
          },
          headerName: t('name')
        },
        {
          width: 300,
          field: 'rayon',
          sortable: true,
          filter: {
            component: TextFilterComponent,
            doesFilterPass: ({ model, node }) => {
              if (!model) {
                return true
              }
              const data = node.data as { rayon: string }
              return data?.rayon?.toLowerCase().includes(model.toLowerCase())
            }
          },
          headerName: t('rayon')
        },
        {
          width: 250,
          field: 'prixod',
          sortable: true,
          editable: (params) => !params.node.rowPinned && params.context?.isEditable,
          cellEditor: NumberEditor,
          valueFormatter: (params) => formatNumber(params.value)
        },
        {
          width: 250,
          field: 'rasxod',
          sortable: true,
          editable: (params) => !params.node.rowPinned && params.context?.isEditable,
          cellEditor: NumberEditor,
          valueFormatter: (params) => formatNumber(params.value)
        },
        {
          width: 250,
          field: 'summa',
          sortable: true,
          valueFormatter: (params) => formatNumber(params.value)
        }
      ]}
      {...props}
    />
  )
}
