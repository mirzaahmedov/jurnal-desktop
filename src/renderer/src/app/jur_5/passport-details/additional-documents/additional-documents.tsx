import type { MainZarplata } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { ListView } from '@/common/views'

import { AdditionalDocumentColumnDefs } from './columns'
import { AdditionalDocumentService } from './service'

interface AdditionalDocumentsProps {
  mainZarplata: MainZarplata
}
export const AdditionalDocuments = ({ mainZarplata }: AdditionalDocumentsProps) => {
  const { t } = useTranslation()

  const { data: documents, isFetching: isFetchingDocuments } = useQuery({
    queryKey: [AdditionalDocumentService.QueryKeys.GetByMainZarplataId, mainZarplata.id],
    queryFn: AdditionalDocumentService.getByMainZarplataId
  })

  return (
    <ListView>
      <ListView.Header className="justify-end">
        <Button>
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={isFetchingDocuments}>
        <GenericTable
          columnDefs={AdditionalDocumentColumnDefs}
          data={documents?.data ?? []}
          className="table-generic-xs"
        />
      </ListView.Content>
    </ListView>
  )
}
