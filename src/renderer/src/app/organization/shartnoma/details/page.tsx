import { useNavigate, useParams } from 'react-router-dom'

import { DetailsView } from '@/common/views'
import { ShartnomaForm } from './shartnoma-form'
import { shartnomaQueryKeys } from '../constants'
import { shartnomaService } from '../service'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useLayout } from '@renderer/common/features/layout'
import { useOrgId } from '../hooks'
import { useQuery } from '@tanstack/react-query'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const ShartnomaDetailsPage = () => {
  const [orgId] = useOrgId()

  const id = useParams().id as string
  const navigate = useNavigate()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

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

  console.log('rendering details page')

  useLayout({
    title: 'Договор',
    onBack() {
      navigate(`/organization/shartnoma`)
    }
  })

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <ShartnomaForm
          dialog={false}
          organization={orgId}
          selected={shartnoma?.data}
          onSuccess={() => {
            navigate(`/organization/shartnoma?org_id=${orgId}`)
          }}
        />
      </DetailsView.Content>
    </DetailsView>
  )
}

export default ShartnomaDetailsPage
