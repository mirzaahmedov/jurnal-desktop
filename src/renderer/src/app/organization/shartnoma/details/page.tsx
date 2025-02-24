import { useEffect } from 'react'

import { mainSchetQueryKeys, mainSchetService } from '@renderer/app/region-spravochnik/main-schet'
import {
  organizationQueryKeys,
  organizationService
} from '@renderer/app/region-spravochnik/organization'
import { Button } from '@renderer/common/components/ui/button'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useToggle } from '@renderer/common/hooks'
import { useQuery } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type Location, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { DetailsView } from '@/common/views'

import { type LocationState, shartnomaQueryKeys } from '../config'
import { ShartnomaSmetaGrafikGeneratePDFDocumentDialog } from '../report/dialog/ShartnomaGrafikDialog'
import { shartnomaService } from '../service'
import { ShartnomaForm } from './shartnoma-form'

const ShartnomaDetailsPage = () => {
  const navigate = useNavigate()
  const reportToggle = useToggle()

  const id = useParams().id as string
  const location = useLocation() as Location<LocationState>

  const original = location.state?.original
  const orgId = location.state?.orgId

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: shartnoma, isFetching } = useQuery({
    queryKey: [
      shartnomaQueryKeys.getById,
      Number(id),
      {
        budjet_id
      }
    ],
    queryFn: shartnomaService.getById,
    enabled: id !== 'create'
  })
  const { data: main_schet } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById
  })
  const { data: organization } = useQuery({
    queryKey: [organizationQueryKeys.getById, shartnoma?.data?.spravochnik_organization_id],
    queryFn: organizationService.getById,
    enabled: !!shartnoma?.data?.spravochnik_organization_id
  })

  useEffect(() => {
    if (!orgId) {
      toast.error('Выберите организацию')
      navigate(`/organization/shartnoma`)
    }
  }, [orgId])

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

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <ShartnomaForm
          dialog={false}
          organization={orgId}
          selected={shartnoma?.data}
          original={original}
          onSuccess={() => {
            navigate(-1)
          }}
        />
      </DetailsView.Content>
      <DetailsView.Footer>
        {id !== 'create' ? (
          <Button
            type="button"
            variant="ghost"
            onClick={reportToggle.open}
            disabled={!main_schet?.data || !organization?.data || !shartnoma?.data}
          >
            <DownloadIcon className="btn-icon icon-start" />
            {t('payment-schedule')}
          </Button>
        ) : null}
      </DetailsView.Footer>
      {id !== 'create' && main_schet?.data && organization?.data && shartnoma?.data ? (
        <ShartnomaSmetaGrafikGeneratePDFDocumentDialog
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
