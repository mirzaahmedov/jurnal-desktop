import { useState } from 'react'

import { LoadingOverlay } from '@renderer/common/components'
import { EmptyList } from '@renderer/common/components/empty-states'
import { Switch } from '@renderer/common/components/ui/switch'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const [status, setStatus] = useState(true)

  const { data: videos, isFetching } = useQuery({
    queryKey: [
      videoQueryKeys.getAll,
      {
        module_id: moduleId,
        status
      }
    ],
    queryFn: VideoService.getAll,
    enabled: !!moduleId
  })

  return (
    <div className="relative h-full">
      {loading || isFetching ? <LoadingOverlay /> : null}
      {readOnly ? null : (
        <div className="py-5 px-8 pb-0 flex items-center gap-2.5">
          <Switch
            checked={status}
            onCheckedChange={setStatus}
          />
          <span className="font-medium">{t('status')}</span>
        </div>
      )}
      <ul className="grid grid-cols-3 p-5">
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
              <EmptyList />
            </div>
          )
        ) : null}
      </ul>
    </div>
  )
}
