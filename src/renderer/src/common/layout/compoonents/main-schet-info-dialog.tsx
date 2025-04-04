import type { DialogProps } from '@radix-ui/react-dialog'

import { useQuery } from '@tanstack/react-query'
import { Trans } from 'react-i18next'

import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { DataList } from '@/common/components/data-list'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { useRequisitesStore } from '@/common/features/requisites'

export const MainSchetInfoDialog = (props: DialogProps) => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { data: main_schet_data } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById,
    enabled: !!main_schet_id
  })

  const main_schet = main_schet_data?.data

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
              value: main_schet?.budjet_name
            },
            {
              name: <Trans>name</Trans>,
              value: main_schet?.account_name
            },
            {
              name: <Trans>raschet-schet</Trans>,
              value: main_schet?.account_number
            },
            {
              name: <Trans>raschet-schet-gazna</Trans>,
              value: main_schet?.gazna_number
            },
            {
              name: <Trans>organization</Trans>,
              value: main_schet?.tashkilot_nomi
            },
            {
              name: <Trans>inn</Trans>,
              value: main_schet?.tashkilot_inn
            },
            {
              name: <Trans>mfo</Trans>,
              value: main_schet?.tashkilot_mfo
            },
            {
              name: <Trans>bank</Trans>,
              value: main_schet?.tashkilot_bank
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
              value: main_schet?.jur1_schet
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
              value: main_schet?.jur2_schet
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
              value: main_schet?.jur3_schet
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
              value: main_schet?.jur4_schet
            },
            {
              name: (
                <>
                  <Trans values={{ nth: 5 }}>mo-nth</Trans>
                  <span className="lowercase">
                    {} <Trans>schet</Trans>
                  </span>
                </>
              ),
              value: main_schet?.jur5_schet
            },
            {
              name: (
                <>
                  <Trans values={{ nth: 7 }}>mo-nth</Trans>
                  <span className="lowercase">
                    {} <Trans>schet</Trans>
                  </span>
                </>
              ),
              value: main_schet?.jur7_schet
            }
          ]}
        />
      </DialogContent>
    </Dialog>
  )
}
