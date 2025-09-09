import type {
  OtdelniyRaschetDeductionDto,
  OtdelniyRaschetPaymentDto
} from '@/common/models/otdelniy-raschet'
import type { FC } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'

import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { DialogContent, DialogOverlay, DialogTrigger } from '@/common/components/jolly/dialog'
import { SummaCell } from '@/common/components/table/renderers/summa'

export interface OtdelniyRaschetDetailsProps extends Omit<DialogTriggerProps, 'children'> {
  payments: OtdelniyRaschetPaymentDto[] | null
  deductions: OtdelniyRaschetDeductionDto[] | null
}
export const OtdelniyRaschetDetails: FC<OtdelniyRaschetDetailsProps> = ({
  payments,
  deductions,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-[600px] pt-10">
          <Allotment>
            <Allotment.Pane
              minSize={300}
              className="overflow-y-auto scrollbar"
            >
              <GenericTable
                data={payments ?? []}
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
                    key: 'summa',
                    renderCell: (row) => <SummaCell summa={row.summa} />
                  }
                ]}
                className="table-generic-xs"
              />
            </Allotment.Pane>
            <Allotment.Pane
              minSize={300}
              className="overflow-y-auto scrollbar flex flex-col ml-px"
            >
              <div className="px-5 py-1.5">
                <h2 className="text-lg font-medium">{t('uderjanie')}</h2>
              </div>
              <div>
                <GenericTable
                  data={deductions ?? []}
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
                      key: 'summa',
                      renderCell: (row) => <SummaCell summa={row.summa} />
                    }
                  ]}
                  className="table-generic-xs"
                />
              </div>
            </Allotment.Pane>
          </Allotment>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
