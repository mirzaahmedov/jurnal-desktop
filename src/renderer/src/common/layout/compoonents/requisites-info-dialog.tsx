import type { MainSchet } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { Trans } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'

export interface RequisitesInfoDialogProps extends DialogProps {
  data: MainSchet
}
export const RequisitesInfoDialog = ({ data, ...props }: RequisitesInfoDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans>main-schet</Trans>
          </DialogTitle>
        </DialogHeader>
        <DataList
          list={[
            {
              name: <Trans>budjet</Trans>,
              value: data?.budjet_name
            },
            {
              name: <Trans>name</Trans>,
              value: data?.account_name
            },
            {
              name: <Trans>raschet-schet</Trans>,
              value: data?.account_number
            },
            {
              name: <Trans>raschet-schet-gazna</Trans>,
              value: data?.gazna_number
            },
            {
              name: <Trans>organization</Trans>,
              value: data?.tashkilot_nomi
            },
            {
              name: <Trans>inn</Trans>,
              value: data?.tashkilot_inn
            },
            {
              name: <Trans>mfo</Trans>,
              value: data?.tashkilot_mfo
            },
            {
              name: <Trans>bank</Trans>,
              value: data?.tashkilot_bank
            },
            {
              name: (
                <>
                  <Trans values={{ nth: 1 }}>mo-nth</Trans>
                  <span className="lowercase">
                    {} <Trans>schet</Trans>
                  </span>
                </>
              ),
              value: data?.jur1_schet
            },
            {
              name: (
                <>
                  <Trans values={{ nth: 2 }}>mo-nth</Trans>
                  <span className="lowercase">
                    {} <Trans>schet</Trans>
                  </span>
                </>
              ),
              value: data?.jur2_schet
            },
            {
              name: (
                <>
                  <Trans values={{ nth: 3 }}>mo-nth</Trans>
                  <span className="lowercase">
                    {} <Trans>schet</Trans>
                  </span>
                </>
              ),
              value: data?.jur3_schet
            },
            {
              name: (
                <>
                  <Trans values={{ nth: 4 }}>mo-nth</Trans>
                  <span className="lowercase">
                    {} <Trans>schet</Trans>
                  </span>
                </>
              ),
              value: data?.jur4_schet
            }
          ]}
        />
      </DialogContent>
    </Dialog>
  )
}
