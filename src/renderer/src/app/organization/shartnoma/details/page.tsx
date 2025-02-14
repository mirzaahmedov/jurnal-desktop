import { useEffect } from 'react'

import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { type Location, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { DetailsView } from '@/common/views'

import { type LocationState, shartnomaQueryKeys } from '../config'
import { shartnomaService } from '../service'
import { ShartnomaForm } from './shartnoma-form'

const ShartnomaDetailsPage = () => {
  const id = useParams().id as string
  const navigate = useNavigate()
  const location = useLocation() as Location<LocationState>

  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const original = location.state?.original
  const orgId = location.state?.orgId

  const { t } = useTranslation(['app'])

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
    </DetailsView>
  )
}

export default ShartnomaDetailsPage
