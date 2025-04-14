import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/common/components/ui/accordion'
import { type NavElement, getNavElements } from '@/common/layout/compoonents/sidebar/config'
import { cn } from '@/common/lib/utils'

export interface NavigationStore {
  isCollapsed: boolean
}
export const Navigation = ({ isCollapsed }: NavigationStore) => {
  const { t } = useTranslation(['app'])
  return (
    <nav>
      <ul>{getNavElements(t).map((elem) => renderNavElement(elem, isCollapsed))}</ul>
    </nav>
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
      className={cn('pl-5 hover:bg-slate-50 transition-colors', !rootPath && 'pr-5')}
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
      className={cn('group pl-5 hover:bg-slate-50 transition-colors', !rootPath && 'pr-5')}
    >
      {elem.displayOnly ? (
        <div
          className={cn(
            'w-full flex items-center py-3 gap-2.5 border-b border-slate-200 group-last:border-none',
            isCollapsed && 'justify-center',
            elem.className
          )}
          title={String(elem.title)}
        >
          {elem.icon && <elem.icon className="size-5" />}
          <span className={cn('w-full font-bold text-sm', isCollapsed && 'hidden')}>
            {elem.title}
          </span>
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
          <span className={cn('font-bold text-sm', isCollapsed && 'hidden')}>{elem.title}</span>
        </NavLink>
      )}
    </li>
  )
}
