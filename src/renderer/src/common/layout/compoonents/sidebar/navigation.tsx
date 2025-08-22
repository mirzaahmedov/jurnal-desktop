import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/common/components/ui/accordion'
import { type INavElement, getNavElements } from '@/common/layout/compoonents/sidebar/config'
import { cn } from '@/common/lib/utils'

const normalizePath = (path: string) => {
  return path.replace(/\/\//g, '/')
}

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

const renderNavElement = (elem: null | INavElement, isCollapsed: boolean, rootPath = '') => {
  if (!elem) {
    return null
  }

  const path = normalizePath(rootPath ? `${rootPath}/${elem.path}` : elem.path)
  return elem.children?.length ? (
    <li key={path}>
      <Accordion type="multiple">
        <AccordionItem value={path}>
          <AccordionTrigger
            className={cn(
              'py-0 px-5 hover:no-underline hover:bg-brand/5 hover:text-brand transition-colors duration-75',
              !rootPath && 'rounded-lg'
            )}
          >
            <span
              className={cn(
                'w-full flex items-center py-3 gap-2.5',
                isCollapsed && 'justify-center'
              )}
              title={String(elem.title)}
            >
              {elem.icon && <elem.icon className="size-5 flex-shrink-0" />}
              {!isCollapsed ? (
                <span className="font-semibold text-sm text-start">{elem.title}</span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-5">
            <ul>{elem.children.map((child) => renderNavElement(child, isCollapsed, path))}</ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </li>
  ) : (
    <li
      key={path}
      className={cn(
        'group pl-5 pr-5 hover:bg-brand/5 hover:text-brand transition-colors duration-75',
        !rootPath && 'pr-5 rounded-lg',
        elem.displayOnly && 'cursor-default hover:bg-transparent'
      )}
    >
      {elem.displayOnly ? (
        <div
          {...elem?.props}
          className={cn(
            'w-full flex items-center py-3 gap-2.5 border-b border-slate-200 group-last:border-none',
            isCollapsed && 'justify-center',
            elem.className
          )}
          title={String(elem.title)}
        >
          {elem.icon && <elem.icon className="size-5 flex-shrink-0" />}
          <span className={cn('w-full font-semibold text-sm break-words', isCollapsed && 'hidden')}>
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
              isActive && 'text-brand before-indicator',
              elem.className
            )
          }
          title={String(elem.title)}
        >
          {elem.icon && <elem.icon className="size-5 flex-shrink-0" />}
          <span className={cn('font-semibold text-sm break-words', isCollapsed && 'hidden')}>
            {elem.title}
          </span>
        </NavLink>
      )}
    </li>
  )
}
