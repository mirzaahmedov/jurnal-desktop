import { Outlet } from 'react-router-dom'
import { useMainSchet } from './store'
import { CircleAlert } from 'lucide-react'

export const MainSchetGuard = () => {
  const { main_schet } = useMainSchet()

  if (!main_schet || !main_schet.id) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <CircleAlert className="size-20 text-slate-500" />
          <h1 className="text-slate-500 text-base font max-w-md text-center">
            Чтобы использовать эту страницу, сначала вам нужно выбрать основной счет.
          </h1>
        </div>
      </div>
    )
  }

  return <Outlet />
}
