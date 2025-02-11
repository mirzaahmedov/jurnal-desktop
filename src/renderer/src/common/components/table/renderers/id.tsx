import { Copyable } from '@/common/components/copyable'

export const IDCell = <T extends { id: number }>(row: T) => {
  return (
    <Copyable value={row.id}>
      <b>#{row.id}</b>
    </Copyable>
  )
}
