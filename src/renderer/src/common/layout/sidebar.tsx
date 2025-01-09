import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@renderer/common/components/ui/accordion'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@renderer/common/components/ui/badge'
import { Button } from '@renderer/common/components/ui/button'
import type { NavElement } from './constants'
import { NavLink } from 'react-router-dom'
import { ScrollArea } from '@/common/components/ui/scroll-area'
import { cn } from '@renderer/common/lib/utils'
import { create } from 'zustand'
import { getNavElements } from './constants'
import logo from '@resources/logo.svg'
import { persist } from 'zustand/middleware'

type SidebarStore = {
  isCollapsed: boolean
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
}

const useSidebarStore = create(
  persist<SidebarStore>(
    (set) => ({
      isCollapsed: false,
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed })
    }),
    {
      name: 'sidebar'
    }
  )
)

const Sidebar = () => {
  const [version, setVersion] = useState('')

  const { isCollapsed, toggleCollapsed } = useSidebarStore()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-version').then(setVersion)
  }, [])

  return (
    <aside
      className="w-full max-w-xs h-full flex flex-col border-r border-slate-200"
      style={{
        maxWidth: isCollapsed ? 112 : undefined
      }}
    >
      <ScrollArea className="h-full">
        <div className="flex flex-col min-h-full">
          <div
            className={cn(
              'flex items-center justify-between p-5 gap-2.5 text-sm bg-white border-b border-slate-200 z-10',
              isCollapsed && 'flex-col-reverse'
            )}
          >
            <img
              src={logo}
              alt="МЧС Республики Узбекистан"
              className="max-h-16"
            />
            {!isCollapsed ? (
              <h1 className="flex-1 text-xs font-bold">
                O‘zbekiston Respublikasi FVV axborot tizimi &quot;Е-Moliya&quot;
              </h1>
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="text-slate-500"
            >
              {isCollapsed ? (
                <ChevronsRight className="size-5" />
              ) : (
                <ChevronsLeft className="size-5" />
              )}
            </Button>
          </div>
          <div className="flex-1">
            <nav>
              <ul>{getNavElements().map((elem) => renderNavElement(elem, isCollapsed))}</ul>
            </nav>
          </div>
          <div
            className={cn(
              'flex items-center p-5 gap-2 flex-wrap justify-center',
              isCollapsed && 'px-1'
            )}
          >
            <ApplicationBadge />
            <p className="text-xs text-slate-500 font-medium">
              {!isCollapsed && 'Электрон молия тизими '}
              v.{version}
            </p>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

const renderNavElement = (elem: null | NavElement, isCollapsed: boolean, rootPath = '') => {
  if (!elem) {
    return null
  }

  const path = rootPath ? `${rootPath}/${elem.path}` : elem.path
  return elem.children?.length ? (
    <li
      key={path}
      className="px-5 hover:bg-slate-50 transition-colors"
    >
      <Accordion type="multiple">
        <AccordionItem value={path}>
          <AccordionTrigger className="py-0 hover:no-underline">
            <span
              className={cn(
                'w-full flex items-center py-3 gap-2.5',
                isCollapsed && 'justify-center'
              )}
              title={String(elem.title)}
            >
              {elem.icon && <elem.icon className="size-5" />}
              {!isCollapsed ? (
                <span className="font-bold text-sm text-start">{elem.title}</span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul>{elem.children.map((child) => renderNavElement(child, isCollapsed, path))}</ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </li>
  ) : (
    <li
      key={path}
      className="group px-5 hover:bg-slate-50 transition-colors"
    >
      {elem.noLink ? (
        <div
          className={cn(
            'flex items-center py-3 gap-2.5 border-b border-slate-200 group-last:border-none',
            isCollapsed && 'justify-center',
            elem.className
          )}
          title={String(elem.title)}
        >
          {elem.icon && <elem.icon className="size-5" />}
          {!isCollapsed ? <span className="font-bold text-sm">{elem.title}</span> : null}
        </div>
      ) : (
        <NavLink
          to={path}
          className={({ isActive }) =>
            cn(
              'flex items-center py-3 gap-2.5 border-b border-slate-200 group-last:border-none',
              isCollapsed && 'justify-center',
              isActive && 'text-brand',
              elem.className
            )
          }
          title={String(elem.title)}
        >
          {elem.icon && <elem.icon className="size-5" />}
          {!isCollapsed ? <span className="font-bold text-sm">{elem.title}</span> : null}
        </NavLink>
      )}
    </li>
  )
}

const ApplicationBadge = () => {
  switch (true) {
    case import.meta.env.DEV:
      return (
        <Badge
          variant="secondary"
          className="bg-brand/10 hover:bg-brand/10 text-brand"
        >
          Разработка
        </Badge>
      )
    case import.meta.env.VITE_MODE === 'staging':
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-500"
        >
          Тестирование
        </Badge>
      )
    default:
      return null
  }
}

export default Sidebar
