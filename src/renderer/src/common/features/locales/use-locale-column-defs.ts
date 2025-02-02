import type { ColumnDef } from '@renderer/common/components'
import type { EditableColumnType } from '@renderer/common/components/editable-table'

import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

export const useLocaleColumnDefs = <
  T extends Record<string, unknown>,
  C extends ColumnDef<T> | EditableColumnType<T>
>(
  columns: C[]
) => {
  const { t } = useTranslation()

  return useMemo(() => {
    return columns.map((column) => {
      if (typeof column.header !== 'string') {
        return column
      }
      return {
        ...column,
        header: t(column.header)
      }
    })
  }, [t])
}
