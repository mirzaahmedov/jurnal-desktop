import { CircleAlert } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useRequisitesStore } from './store'

export const RequisitesGuard = () => {
  const { main_schet_id, budjet_id } = useRequisitesStore()

  if (!main_schet_id || !budjet_id) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <CircleAlert className="size-20 text-slate-500" />
          <h1 className="text-slate-500 text-base font max-w-md text-center">
            Чтобы использовать эту страницу, сначала вам нужно выбрать реквизиты
          </h1>
        </div>
      </div>
    )
  }

  return <Outlet />
}
