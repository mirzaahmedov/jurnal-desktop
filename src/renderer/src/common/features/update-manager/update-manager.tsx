// import { LoadingSpinner } from '@renderer/common/components'
import { ToastAction } from '@renderer/common/components/ui/toast'
import { events } from '@main/auto-updater'
import { toast } from '@/common/hooks/use-toast'
import { useEffect } from 'react'

const ipcRenderer = window.electron.ipcRenderer

const UpdateManager = () => {
  // const progressId = useId()

  useEffect(() => {
    ipcRenderer.send('check-for-updates')
    ipcRenderer.on(events.checking_for_update, () => {
      toast({
        title: 'Проверка обновлений',
        duration: Infinity
      })
    })
    ipcRenderer.on(events.update_available, () => {
      toast({
        title: 'Доступно обновление',
        duration: Infinity
      })
    })
    // ipcRenderer.on(events.download_progress, (_, progress) => {
    //   toast({
    //     title: `Загрузка обновлений: ${parseInt(progress.percent)}%`,
    //     action: <LoadingSpinner />
    //   })
    // })
    ipcRenderer.on(events.update_downloaded, () => {
      toast({
        title: 'Обновление загружено',
        duration: Infinity,
        action: (
          <ToastAction
            onClick={() => {
              ipcRenderer.send('restart')
            }}
            altText="Перезапустить приложение"
          >
            Перезапустить
          </ToastAction>
        )
      })
    })
    ipcRenderer.on(events.error, (_, error) => {
      console.log(error)
      toast({
        title: 'Ошибка при обновлении',
        description: error.message,
        duration: Infinity,
        variant: 'destructive'
      })
    })
  }, [])

  return null
}

export { UpdateManager }
