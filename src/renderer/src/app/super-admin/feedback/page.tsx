import { useQuery } from '@tanstack/react-query'

import { GridTable } from '@/common/components/grid-table/table'
import { FeedbackQueryKeys, FeedbackService } from '@/common/features/feedback/service'

const FeedbackPage = () => {
  console.log({ getAll: FeedbackService.getAll })

  const { data: feedbacks, isFetching } = useQuery({
    queryKey: FeedbackQueryKeys.getAll(),
    queryFn: FeedbackService.getAll
  })

  return (
    <GridTable
      rowData={feedbacks ?? []}
      loading={isFetching}
    />
  )
}

export default FeedbackPage
