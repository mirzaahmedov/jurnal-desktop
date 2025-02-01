import { type Location, useLocation, useNavigate, useParams } from 'react-router-dom'

import { DetailsView } from '@/common/views'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import type { Shartnoma } from '@renderer/common/models'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { shartnomaQueryKeys } from '../constants'
import { useOrgId } from '../hooks'
import { shartnomaService } from '../service'
import { ShartnomaForm } from './shartnoma-form'
import { parseAsBoolean, useQueryState } from 'nuqs'

const ShartnomaDetailsPage = () => {
  const [orgId] = useOrgId()
  const [orgSelected] = useQueryState('org_selected', parseAsBoolean.withDefault(false))

  const id = useParams().id as string
  const navigate = useNavigate()
  const location = useLocation() as Location<{ original?: Shartnoma }>
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const original = location.state?.original

  const { t } = useTranslation(['app'])

  const { data: shartnoma, isFetching } = useQuery({
    queryKey: [
      shartnomaQueryKeys.getById,
      Number(id),
      {
        main_schet_id
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
        navigate(`/organization/shartnoma${orgSelected ? `?org_id=${orgId}` : ''}`)
      }
    })
  }, [navigate, setLayout, id, t, orgId, orgSelected])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <ShartnomaForm
          dialog={false}
          organization={orgId}
          selected={shartnoma?.data}
          original={original}
          onSuccess={() => {
            navigate(`/organization/shartnoma?org_id=${orgId}`)
          }}
        />
      </DetailsView.Content>
    </DetailsView>
  )
}

export default ShartnomaDetailsPage
