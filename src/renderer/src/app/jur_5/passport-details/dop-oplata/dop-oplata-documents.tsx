import type { MainZarplata } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useToggle } from '@/common/hooks'
import { ListView } from '@/common/views'

import { DopOplataColumnDefs } from './columns'
import { DopOplataDialog } from './dialog'
import { DopOplataService } from './service'

interface DopOplataDocumentProps {
  mainZarplata: MainZarplata
}
export const DopOplataDocuments = ({ mainZarplata }: DopOplataDocumentProps) => {
  const { t } = useTranslation()

  const dialogToggle = useToggle()

  const { data: documents, isFetching: isFetchingDocuments } = useQuery({
    queryKey: [DopOplataService.QueryKeys.GetByMainZarplataId, mainZarplata.id],
    queryFn: DopOplataService.getByMainZarplataId
  })

  return (
    <ListView>
      <ListView.Header className="justify-end">
        <Button onClick={dialogToggle.open}>
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={isFetchingDocuments}>
        <GenericTable
          columnDefs={DopOplataColumnDefs}
          data={documents?.data ?? []}
          className="table-generic-xs"
        />
      </ListView.Content>

      <DopOplataDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplata={mainZarplata}
      />
    </ListView>
  )
}
