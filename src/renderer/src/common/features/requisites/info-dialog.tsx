import type { DialogProps } from '@radix-ui/react-dialog'

import { useQuery } from '@tanstack/react-query'
import { Trans } from 'react-i18next'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { DataList } from '@/common/components/data-list'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'

import { useRequisitesStore } from './store'

export const RequisitesInfoDialog = (props: DialogProps) => {
  const { main_schet_id, jur3_schet_id, jur4_schet_id } = useRequisitesStore()

  const { data } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById,
    enabled: !!main_schet_id
  })

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
              value: data?.data?.budjet_name
            },
            {
              name: <Trans>name</Trans>,
              value: data?.data?.account_name
            },
            {
              name: <Trans>raschet-schet</Trans>,
              value: data?.data?.account_number
            },
            {
              name: <Trans>raschet-schet-gazna</Trans>,
              value: data?.data?.gazna_number
            },
            {
              name: <Trans>organization</Trans>,
              value: data?.data?.tashkilot_nomi
            },
            {
              name: <Trans>inn</Trans>,
              value: data?.data?.tashkilot_inn
            },
            {
              name: <Trans>mfo</Trans>,
              value: data?.data?.tashkilot_mfo
            },
            {
              name: <Trans>bank</Trans>,
              value: data?.data?.tashkilot_bank
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
              value: data?.data?.jur1_schet
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
              value: data?.data?.jur2_schet
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
              value: data?.data?.jur3_schets?.find((schet) => schet.id === jur3_schet_id)?.schet
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
              value: data?.data?.jur4_schets?.find((schet) => schet.id === jur4_schet_id)?.schet
            }
          ]}
        />
      </DialogContent>
    </Dialog>
  )
}
