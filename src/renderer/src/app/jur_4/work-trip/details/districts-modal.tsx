import type { Constant } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { GenericTable } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import { DialogContent, DialogOverlay, DialogTrigger } from '@/common/components/jolly/dialog'
import { useConstantsStore } from '@/common/features/constants/store'

export interface DistrictsModalProps extends Omit<DialogTriggerProps, 'children'> {
  onSelect: (district: Constant.District) => void
}
export const DistrictsModal = ({ onSelect, ...props }: DistrictsModalProps) => {
  const { regions, districts } = useConstantsStore()

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-2xl p-1 overflow-hidden">
          <div className="h-full max-h-[600px] overflow-y-auto scrollbar">
            <CollapsibleTable
              data={regions}
              columnDefs={[
                {
                  key: 'name'
                }
              ]}
              getRowId={(row) => row.id}
              className="table-generic-xs"
              classNames={{
                header: 'z-100'
              }}
            >
              {({ row }) => (
                <div
                  ref={(ref) => ref?.focus()}
                  className="pl-10"
                >
                  <GenericTable
                    data={districts.filter((district) => district.region_id === row.id)}
                    columnDefs={[
                      {
                        key: 'name'
                      }
                    ]}
                    onClickRow={onSelect}
                  />
                </div>
              )}
            </CollapsibleTable>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
