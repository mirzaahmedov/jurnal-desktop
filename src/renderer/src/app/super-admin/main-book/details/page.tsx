import { Button } from '@renderer/common/components/ui/button'
import { DetailsView } from '@renderer/common/views'
import { adminMainBookService } from '../service'
import { queryKeys } from '../config'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const AdminMainbookDetailsPage = () => {
  const params = useParams()

  const { data: report, isFetching } = useQuery({
    queryKey: [queryKeys.getById, Number(params.id)],
    queryFn: adminMainBookService.getById
  })

  return (
    <DetailsView>
      <DetailsView.Content></DetailsView.Content>
      <DetailsView.Footer>
        <Button></Button>
      </DetailsView.Footer>
    </DetailsView>
  )
}

export { AdminMainbookDetailsPage }
