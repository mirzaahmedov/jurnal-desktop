import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle
} from '@renderer/common/components/ui/alert-dialog'
import { Check, Download, MessageCircleWarning, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Progress } from '@renderer/common/components/ui/progress'
import { cn } from '@renderer/common/lib/utils'
import { events } from '@main/auto-updater'
import { toast } from '@renderer/common/hooks/use-toast'

const ipcRenderer = window.electron.ipcRenderer

type UpdateStatus = 'available' | 'downloading' | 'downloaded' | 'error'

const UpdateManager = () => {
  const [status, setStatus] = useState<UpdateStatus>()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    ipcRenderer.send('check-for-updates')
    ipcRenderer.on(events.checking_for_update, () => {
      toast({
        title: 'Проверка обновлений'
      })
    })

    ipcRenderer.on(events.update_available, () => {
      setStatus('available')
    })
    ipcRenderer.on(events.download_progress, (_, progress) => {
      setStatus('downloading')
      setProgress(progress.percent)
    })
    ipcRenderer.on(events.update_downloaded, () => {
      setStatus('downloaded')
      setProgress(0)
    })
    ipcRenderer.on(events.error, (_, error) => {
      console.log(error)
      setStatus('error')
      setProgress(0)
    })

    return () => {
      ipcRenderer.removeAllListeners(events.checking_for_update)
      ipcRenderer.removeAllListeners(events.update_available)
      ipcRenderer.removeAllListeners(events.download_progress)
      ipcRenderer.removeAllListeners(events.update_downloaded)
      ipcRenderer.removeAllListeners(events.error)
    }
  }, [])

  const isOpen = !!status
  const handleOpenChange = () => {
    setProgress(0)
    setStatus((prev) => (prev === 'downloading' ? prev : undefined))
  }
  const handleRestart = () => {
    ipcRenderer.send('restart')
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent>
        <div className="flex items-center gap-5">
          {status ? <AlertIcon type={status} /> : null}
          <AlertDialogTitle className="text-xl font-bold">
            {status === 'available'
              ? 'Доступно обновление'
              : status === 'downloading'
                ? 'Загрузка обновления'
                : status === 'downloaded'
                  ? 'Обновление загружено'
                  : status === 'error'
                    ? 'Ошибка при обновлении'
                    : null}
          </AlertDialogTitle>
        </div>
        {status === 'downloading' && <Progress value={progress} />}
        {(status === 'downloaded' || status === 'error') && (
          <AlertDialogFooter>
            {status === 'downloaded' && (
              <AlertDialogAction onClick={handleRestart}>Перезапустить</AlertDialogAction>
            )}
            {(status === 'downloaded' || status === 'error') && (
              <AlertDialogCancel>Закрыть</AlertDialogCancel>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

type AlertIconProps = {
  type: UpdateStatus
}
const AlertIcon = ({ type }: AlertIconProps) => {
  let Icon = Check

  if (type === 'error') {
    Icon = TriangleAlert
  }
  if (type === 'downloading') {
    Icon = Download
  }
  if (type === 'available') {
    Icon = MessageCircleWarning
  }

  return (
    <div
      className={cn(
        'bg-red-50 size-16 flex items-center justify-center rounded-full',
        type === 'error' && 'bg-red-50',
        type === 'available' && 'bg-yellow-50',
        type === 'downloading' && 'bg-blue-50',
        type === 'downloaded' && 'bg-emerald-50'
      )}
    >
      <Icon
        className={cn(
          'block size-6',
          type === 'error' && 'text-red-500',
          type === 'available' && 'text-yellow-500',
          type === 'downloading' && 'text-blue-500',
          type === 'downloaded' && 'text-emerald-500'
        )}
      />
    </div>
  )
}

export { UpdateManager }
