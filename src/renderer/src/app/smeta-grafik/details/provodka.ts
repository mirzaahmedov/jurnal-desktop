import type { SmetaGrafikProvodkaFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createSmetaEditor } from '@/common/components/editable-table/editors'

export const getProvodkaColumns = ({ readOnly }: { readOnly: boolean }) =>
  [
    {
      key: 'smeta_id',
      header: 'smeta',
      minWidth: 200,
      Editor: createSmetaEditor({ readOnly }),
      className: 'sticky left-0 z-50',
      headerClassName: 'sticky left-0 z-50'
    },
    {
      key: 'oy_1',
      header: 'january',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_1', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_2',
      header: 'february',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_2', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_3',
      header: 'march',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_3', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_4',
      header: 'april',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_4', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_5',
      header: 'may',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_5', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_6',
      header: 'june',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_6', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_7',
      header: 'july',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_7', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_8',
      header: 'august',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_8', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_9',
      header: 'september',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_9', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_10',
      header: 'october',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_10', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_11',
      header: 'november',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_11', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'oy_12',
      header: 'december',
      headerClassName: 'text-end',
      minWidth: 80,
      Editor: createNumberEditor({ key: 'oy_12', inputProps: { adjustWidth: true }, readOnly })
    },
    {
      key: 'total',
      minWidth: 80,
      Editor: createNumberEditor({
        key: 'total',
        inputProps: { adjustWidth: true },
        readOnly: true
      }),
      className: 'sticky right-0 border-l z-50 font-bold',
      headerClassName: 'sticky right-0 border-l z-50 text-end'
    }
  ] satisfies EditableColumnDef<SmetaGrafikProvodkaFormValues>[]
