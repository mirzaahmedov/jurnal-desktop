import type { Video } from '@renderer/common/models'

import { Button } from '@renderer/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/common/components/ui/dropdown-menu'
import { VideoPlayer } from '@renderer/common/components/video-player'
import { formatLocaleDateTime } from '@renderer/common/lib/format'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getVideoURL } from './utils'

export interface VideoCardProps {
  video: Video
  onEdit?: (selected: Video) => void
  onDelete?: (selected: Video) => void
}
export const VideoCard = ({ video, onEdit, onDelete }: VideoCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="p-2 space-y-2">
      <VideoPlayer src={getVideoURL({ id: video.id })} />
      <div className="flex items-start gap-2">
        <div className="spacey-y-1 flex-1">
          <h6 className="font-bold text-sm">{video.name}</h6>
          <p className="mt-0.5 text-sm text-slate-500">{formatLocaleDateTime(video.created_at)}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <Ellipsis className="btn-icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer text-sm font-medium"
              onClick={() => onEdit?.(video)}
            >
              <Pencil className="btn-icon" /> {t('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-500 hover:!text-red-500 text-sm font-medium"
              onClick={() => onDelete?.(video)}
            >
              <Trash2 className="btn-icon" /> {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
