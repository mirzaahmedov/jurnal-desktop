import type { Autocomplete } from '@renderer/common/lib/types'
import type { ReactNode } from 'react'

type ColumnDef<T> = {
  numeric?: boolean
  fit?: boolean
  stretch?: boolean
  key: Autocomplete<keyof T>
  header: ReactNode
  className?: string
  headerClassName?: string
  renderCell?(row: T, col: ColumnDef<T>): ReactNode
}

export type { ColumnDef }
