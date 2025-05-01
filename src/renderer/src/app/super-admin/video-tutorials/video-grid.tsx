import { useQuery } from '@tanstack/react-query'

import { LoadingOverlay } from '@/common/components'
import { EmptyList } from '@/common/components/empty-states'

import { videoQueryKeys } from './config'
import { VideoService } from './service'
import { VideoCard, type VideoCardProps } from './video-card'

export interface VideoGirdProps extends Pick<VideoCardProps, 'onEdit' | 'onDelete'> {
  readOnly?: boolean
  loading?: boolean
  moduleId: number
}
export const VideoGrid = ({
  readOnly = false,
  loading = false,
  moduleId,
  onEdit,
  onDelete
}: VideoGirdProps) => {
  const { data: videos, isFetching } = useQuery({
    queryKey: [
      videoQueryKeys.getAll,
      {
        module_id: moduleId
      }
    ],
    queryFn: VideoService.getAll,
    enabled: !!moduleId
  })

  return (
    <div className="relative h-full">
      <ul className="grid grid-cols-3 p-5">
        {loading || isFetching ? <LoadingOverlay /> : null}
        {Array.isArray(videos?.data) ? (
          videos.data.length > 0 ? (
            videos.data.map((video) => (
              <li key={video.id}>
                <VideoCard
                  readOnly={readOnly}
                  video={video}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            ))
          ) : (
            <div className="col-span-full grid place-items-center">
              <EmptyList
                iconProps={{
                  className: 'h-64'
                }}
              />
            </div>
          )
        ) : null}
      </ul>
    </div>
  )
}
