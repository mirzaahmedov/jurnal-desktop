import { CheckCircle } from 'lucide-react'

import { Copyable } from '@/common/components/copyable'

export const IDCell = <T extends { id: number }>(row: T) => {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="group-data-[selected=true]:block hidden size-6 text-brand" />
      <Copyable value={row.id}>
        <b>#{row.id}</b>
      </Copyable>
    </div>
  )
}
