import { SpravochnikHookOptions, useSpravochnik } from '@renderer/common/features/spravochnik'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/common/components/ui/table'

import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'

type ColumnDef<T extends Record<string, unknown>> = {
  key: keyof T
  header: string
  renderCell?(row: T): React.ReactNode
}
type CreateColumnDefsParams<T extends { id: number }> = {
  useSpravochniks: Record<keyof T, SpravochnikHookOptions<T>>
}
const createColumnsDefs = <T extends Record<string, unknown>>(
  params: CreateColumnDefsParams<T>,
  columns: ColumnDef<T>[]
) => {}

export const EditableTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Header 1</TableHeader>
          <TableHeader>Header 2</TableHeader>
          <TableHeader>Header 3</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {(() => (
          <TableRow>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </TableRow>
        ))()}
        <TableRow>
          <td>Cell 4</td>
          <td>Cell 5</td>
          <td>Cell 6</td>
        </TableRow>
        <TableRow>
          <td>Cell 7</td>
          <td>Cell 8</td>
          <td>Cell 9</td>
        </TableRow>
      </TableBody>
    </Table>
  )
}

const columnDefs = createColumnDefs(
  {
    useStore() {
      const smetaSpravochnik = useSpravochnik(createSmetaSpravochnik({}))
      const shartnomaSpravochnik = useSpravochnik(createShartnomaSpravochnik({}))

      return {
        smeta: smetaSpravochnik,
        shartnoma: shartnomaSpravochnik
      }
    }
  },
  [
    {
      key: 'id',
      header: 'ID'
    }
  ]
)
