import { useQuery } from '@tanstack/react-query'
import { Trans } from 'react-i18next'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { DataList } from '@/common/components/data-list'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { useRequisitesStore } from './store'

interface RequisitesInfoDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}
export const RequisitesInfoDialog = (props: RequisitesInfoDialogProps) => {
  const { main_schet_id, jur3_schet_152_id, jur3_schet_159_id, jur4_schet_id } =
    useRequisitesStore()

  const { data } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById,
    enabled: !!main_schet_id
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
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
                    <Trans values={{ nth: 152 }}>mo-nth</Trans>
                    <span className="lowercase">
                      {} <Trans>schet</Trans>
                    </span>
                  </>
                ),
                value: data?.data?.jur3_schets_152?.find((schet) => schet.id === jur3_schet_152_id)
                  ?.schet
              },
              {
                name: (
                  <>
                    <Trans values={{ nth: 159 }}>mo-nth</Trans>
                    <span className="lowercase">
                      {} <Trans>schet</Trans>
                    </span>
                  </>
                ),
                value: data?.data?.jur3_schets_159?.find((schet) => schet.id === jur3_schet_159_id)
                  ?.schet
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
      </DialogOverlay>
    </DialogTrigger>
  )
}
