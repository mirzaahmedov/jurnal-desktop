import { useEffect, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type Location, useLocation, useNavigate, useParams } from 'react-router-dom'

import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { OrganizationQueryKeys, OrganizationService } from '@/app/region-spravochnik/organization'
import { Button } from '@/common/components/ui/button'
import { GenerateFile } from '@/common/features/file'
import { usePodpis } from '@/common/features/podpis'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { calculateAnnualTotalSum, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'
import { PodpisTypeDocument } from '@/common/models'
import { DetailsView } from '@/common/views'

import { type LocationState, ShartnomaQueryKeys } from '../config'
import { ShartnomaGrafikPDFV2 } from '../report-v2'
import { ContractService } from '../service'
import { ShartnomaGrafikPDFDialog } from '../shartnoma-grafik-pdf-dialog'
import { ShartnomaForm } from './shartnoma-form'

const ShartnomaDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const navigate = useNavigate()
  const reportToggle = useToggle()

  const location = useLocation() as Location<LocationState>
  const podpis = usePodpis(PodpisTypeDocument.SHARTNOMA_GRAFIK_OPLATI, true)

  const original = location.state?.original
  const organId = location.state?.organId

  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: shartnoma, isFetching } = useQuery({
    queryKey: [
      ShartnomaQueryKeys.getById,
      Number(id),
      {
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: ContractService.getById,
    enabled: id !== 'create'
  })
  const { data: main_schet } = useQuery({
    queryKey: [MainSchetQueryKeys.getById, main_schet_id],
    queryFn: MainSchetService.getById
  })
  const { data: organization } = useQuery({
    queryKey: [OrganizationQueryKeys.getById, shartnoma?.data?.spravochnik_organization_id],
    queryFn: OrganizationService.getById,
    enabled: !!shartnoma?.data?.spravochnik_organization_id
  })

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        },
        {
          title: t('pages.shartnoma'),
          path: '/organization/shartnoma'
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [navigate, setLayout, id, t])

  const summaTotal = useMemo(() => {
    return roundNumberToTwoDecimalPlaces(
      shartnoma?.data?.grafiks?.reduce(
        (result, grafik) => result + calculateAnnualTotalSum(grafik),
        0
      ) ?? 0
    )
  }, [shartnoma?.data?.grafiks])

  return (
    <DetailsView>
      <DetailsView.Content isLoading={isFetching}>
        <ShartnomaForm
          dialog={false}
          organId={organId}
          selected={shartnoma?.data}
          original={original}
          onSuccess={() => {
            navigate(-1)
          }}
        />
      </DetailsView.Content>
      {id !== 'create' ? (
        <DetailsView.Footer>
          <Button
            type="button"
            variant="ghost"
            onClick={reportToggle.open}
            disabled={!main_schet?.data || !organization?.data || !shartnoma?.data}
          >
            <DownloadIcon className="btn-icon icon-start" />
            {t('payment-schedule')}
          </Button>

          {id !== 'create' && main_schet?.data && organization?.data && shartnoma?.data ? (
            <GenerateFile
              fileName={`${t('payment-schedule')}_v2_${shartnoma.data.doc_num}.pdf`}
              buttonText={t('payment-schedule') + ' (2)'}
            >
              <ShartnomaGrafikPDFV2
                docNum={shartnoma.data.doc_num}
                docDate={shartnoma.data.doc_date}
                grafiks={shartnoma.data.grafiks}
                podpis={podpis}
                organName={organization.data.name ?? ''}
                regionName={main_schet.data.tashkilot_nomi ?? ''}
                summaValue={summaTotal}
              />
            </GenerateFile>
          ) : null}
        </DetailsView.Footer>
      ) : null}

      {id !== 'create' && main_schet?.data && organization?.data && shartnoma?.data ? (
        <ShartnomaGrafikPDFDialog
          open={reportToggle.isOpen}
          onChange={reportToggle.setOpen}
          grafiks={shartnoma.data.grafiks}
          main_schet={main_schet.data}
          organization={organization.data}
          doc_date={shartnoma.data.doc_date}
          doc_num={shartnoma.data.doc_num}
        />
      ) : null}
    </DetailsView>
  )
}

export default ShartnomaDetailsPage
