import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { DialogContent, DialogOverlay, DialogTrigger } from '@/common/components/jolly/dialog'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const NachislenieOtdelniyRaschetDialog = (props: any) => {
  const { t } = useTranslation()
  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-7xl">
          <div className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] px-5 gap-5">
            <div className="bg-teal-700 p-5 rounded-xl h-full flex flex-col">
              <div className="flex items-center justify-between gap-5 mb-4">
                <h2 className="text-xl text-white font-medium mb-2">{t('nachislenie')}</h2>
              </div>
              <div className="flex-1 overflow-auto scrollbar">
                <GenericTable
                  data={props?.payments ?? []}
                  columnDefs={[
                    {
                      key: 'paymentName',
                      header: 'name'
                    },
                    {
                      key: 'percentage',
                      header: 'foiz'
                    },
                    {
                      numeric: true,
                      key: 'summa',
                      renderCell: (row) => <SummaCell summa={row.summa} />
                    }
                  ]}
                  className="table-generic-xs shadow-md rounded overflow-hidden"
                />
              </div>
            </div>
            <div className="bg-teal-700 p-5 rounded-xl">
              <div className="flex items-center justify-between gap-5 mb-4">
                <h2 className="text-xl text-white font-medium mb-2">{t('uderjanie')}</h2>
              </div>
              <GenericTable
                data={props.deductions ?? []}
                columnDefs={[
                  {
                    key: 'deductionName',
                    header: 'name'
                  },
                  {
                    key: 'percentage',
                    header: 'foiz'
                  },
                  {
                    numeric: true,
                    key: 'summa',
                    renderCell: (row) => <SummaCell summa={row.summa} />
                  }
                ]}
                className="table-generic-xs shadow-md rounded overflow-hidden"
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
