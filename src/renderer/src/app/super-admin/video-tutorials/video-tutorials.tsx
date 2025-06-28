import type { Video } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'

import { videoQueryKeys } from './config'
import { VideoService } from './service'
import { VideoDialog } from './video-dialog'
import { VideoGrid } from './video-grid'
import { VideoModuleList } from './video-module-list'

export interface VideoTutorialsProps {
  readOnly?: boolean
}
export const VideoTutorials = ({ readOnly = false }: VideoTutorialsProps) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [moduleId, setModuleId] = useState<number | null>(null)
  const [selected, setSelected] = useState<Video | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { mutate: deleteVideo, isPending: isDeletingVideo } = useMutation({
    mutationFn: VideoService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [videoQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (video: Video) => {
    setSelected(video)
    requestAnimationFrame(() => dialogToggle.open())
  }
  const handleClickDelete = (video: Video) => {
    requestAnimationFrame(() =>
      confirm({
        onConfirm() {
          deleteVideo({
            id: video.id
          })
        }
      })
    )
  }

  useEffect(() => {
    setLayout({
      title: t('pages.video_tutorials'),
      onCreate: readOnly
        ? undefined
        : () => {
            dialogToggle.open()
            setSelected(null)
          }
    })
  }, [setLayout, dialogToggle.open, t, readOnly])

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  return (
    <div className="flex-1 min-h-0 flex w-full">
      <aside className="w-full max-w-sm border-r border-slate-200">
        <VideoModuleList
          readOnly={readOnly}
          selectedId={moduleId}
          onSelect={(selected) => setModuleId(selected.id)}
        />
      </aside>
      <main className="flex-1">
        {moduleId ? (
          <>
            <VideoGrid
              readOnly={readOnly}
              moduleId={moduleId}
              onEdit={handleClickEdit}
              onDelete={handleClickDelete}
              loading={isDeletingVideo}
            />
            {readOnly ? null : (
              <VideoDialog
                moduleId={moduleId}
                open={dialogToggle.isOpen}
                onOpenChange={dialogToggle.setOpen}
                selected={selected}
              />
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
