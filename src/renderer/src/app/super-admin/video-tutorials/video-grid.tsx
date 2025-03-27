import { LoadingOverlay } from '@renderer/common/components'
import { useQuery } from '@tanstack/react-query'

import { videoQueryKeys } from './config'
import { VideoService } from './service'
import { VideoCard, type VideoCardProps } from './video-card'

export interface VideoGirdProps extends Pick<VideoCardProps, 'onEdit' | 'onDelete'> {
  loading?: boolean
  moduleId: number
}
export const VideoGrid = ({ loading = false, moduleId, onEdit, onDelete }: VideoGirdProps) => {
  const { data: videos, isFetching } = useQuery({
    queryKey: [videoQueryKeys.getAll, { module_id: moduleId }],
    queryFn: VideoService.getAll,
    enabled: !!moduleId
  })

  return (
    <div className="relative h-full">
      {loading || isFetching ? <LoadingOverlay /> : null}
      <ul className="grid grid-cols-4 p-5">
        {Array.isArray(videos?.data)
          ? videos.data.map((video) => (
              <li key={video.id}>
                <VideoCard
                  video={video}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
