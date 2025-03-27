import type { Video } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { videoQueryKeys } from './config'
import { VideoService } from './service'
import { VideoDialog } from './video-dialog'
import { VideoGrid } from './video-grid'
import { VideoModuleList } from './video-module-list'

const VideoTutorialsPage = () => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [moduleId, setModuleId] = useState<number | null>(null)
  const [selected, setSelected] = useState<Video | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { mutate: deleteVideo, isPending: isDeletingVideo } = useMutation({
    mutationFn: VideoService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [videoQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.video_tutorials'),
      onCreate: () => {
        dialogToggle.open()
        setSelected(null)
      }
    })
  }, [setLayout, t, dialogToggle.open])

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
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  return (
    <div className="flex w-full h-full">
      <aside className="w-full max-w-sm border-r border-slate-200">
        <VideoModuleList
          selectedId={moduleId}
          onSelect={(selected) => setModuleId(selected.id)}
        />
      </aside>
      <main className="flex-1">
        {moduleId ? (
          <>
            <VideoGrid
              moduleId={moduleId}
              onEdit={handleClickEdit}
              onDelete={handleClickDelete}
              loading={isDeletingVideo}
            />
            <VideoDialog
              moduleId={moduleId}
              open={dialogToggle.isOpen}
              onOpenChange={dialogToggle.setOpen}
              selected={selected}
            />
          </>
        ) : null}
      </main>
    </div>
  )
}

export default VideoTutorialsPage
