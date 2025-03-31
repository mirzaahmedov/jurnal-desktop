import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { EmptyList } from '@/common/components/empty-states'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'

import { videoQueryKeys } from './config'
import { VideoService } from './service'
import { VideoCard, type VideoCardProps } from './video-card'

enum TabOption {
  SuperAdmin = 'super-admin',
  Region = 'region'
}

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

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.Region)

  const { data: videos, isFetching } = useQuery({
    queryKey: [
      videoQueryKeys.getAll,
      {
        module_id: moduleId,
        status: tabValue === TabOption.SuperAdmin
      }
    ],
    queryFn: VideoService.getAll,
    enabled: !!moduleId
  })

  return (
    <div className="relative h-full">
      <Tabs
        value={tabValue}
        onValueChange={(value) => setTabValue(value as TabOption)}
      >
        {readOnly ? null : (
          <div className="p-5">
            <TabsList>
              <TabsTrigger value={TabOption.SuperAdmin}>{t('super-admin')}</TabsTrigger>
              <TabsTrigger value={TabOption.Region}>{t('region')}</TabsTrigger>
            </TabsList>
          </div>
        )}
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
                <EmptyList />
              </div>
            )
          ) : null}
        </ul>
      </Tabs>
    </div>
  )
}
