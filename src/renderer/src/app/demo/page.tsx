import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { smetaQueryKeys, smetaService } from '../super-admin/smeta'

import { CollapsibleTable } from './collapsible-table'
import { LoadingOverlay } from '@/common/components'
import { ScrollArea } from '@renderer/common/components/ui/scroll-area'
import { SmetaFilter } from './smeta-filter'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const DemoPage = () => {
  const [group, setGroup] = useState<number>(1)

  const {
    data: smetaList,
    error,
    isFetching
  } = useQuery({
    queryKey: [
      smetaQueryKeys.getAll,
      {
        page: 1,
        limit: 10000
      }
    ],
    queryFn: smetaService.getAll,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  return (
    <Dialog open>
      <DialogContent className="max-w-screen-2xl w-full p-0 gap-0 h-3/5 overflow-auto flex flex-col">
        {isFetching ? <LoadingOverlay /> : null}
        <DialogHeader className="flex-0 p-5 flex items-center flex-row gap-5">
          <DialogTitle>Смета справочник</DialogTitle>
          <div>
            <SmetaFilter value={group} onChange={setGroup} />
          </div>
        </DialogHeader>
        {error ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <h3 className="text-xl">Не удалось получить данные :(</h3>
            <p className="text-sm text-slate-500">{error?.message}</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <CollapsibleTable
                data={(smetaList?.data ?? []).filter(
                  (smeta) => smeta.group_number === String(group)
                )}
              />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DemoPage
