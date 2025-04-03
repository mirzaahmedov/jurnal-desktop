import type { UseSpravochnikReturn } from '@renderer/common/features/spravochnik'

import { Button } from '@renderer/common/components/ui/button'
import { CircleCheck, CircleX } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export type ChooseSpravochnikProps<T> = {
  disabled?: boolean
  spravochnik: UseSpravochnikReturn<T>
  placeholder: string
  getName: (selected: T) => string
  getElements: (selected: T) => { name: string; value: string }[]
}
export const ChooseSpravochnik = <T,>(props: ChooseSpravochnikProps<T>) => {
  const { disabled, spravochnik, placeholder, getName, getElements } = props

  return (
    <div className="border-2 border-slate-100 rounded-xl flex flex-wrap justify-between items-center gap-20">
      {spravochnik?.selected ? (
        <Popover>
          <PopoverTrigger disabled={disabled}>
            <div className="px-5 py-2.5 flex items-center gap-10">
              <h3 className="text-xs text-foreground/90 text-md leading-none font-bold">
                {getName(spravochnik.selected)}
              </h3>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Close"
                  onClick={(e) => {
                    e.stopPropagation()
                    spravochnik.clear()
                  }}
                  className="hover:text-destructive text-slate-400"
                >
                  <CircleX className="btn-icon icon-start !mr-0" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Выбрать"
                  onClick={(e) => {
                    e.stopPropagation()
                    spravochnik.open()
                  }}
                  className="text-slate-400"
                  disabled={disabled}
                >
                  <CircleCheck className="btn-icon icon-start !mr-0" />
                </Button>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)] min-w-96"
          >
            <ul className="text-xs space-y-1.5">
              {getElements(spravochnik.selected).map(({ name, value }) => (
                <li
                  key={name}
                  className="grid grid-cols-6 gap-2 text-slate-600"
                >
                  <span className="col-span-2 text-slate-500 font-medium">{name}:</span>
                  <span className="col-span-4 font-bold text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="px-5 py-2.5 self-stretch flex items-center gap-10">
          <h6 className="text-sm text-slate-500">{placeholder}</h6>
          <Button
            variant="ghost"
            size="icon"
            title="Выбрать"
            onClick={spravochnik?.open}
            className="text-slate-400"
            disabled={disabled}
          >
            <CircleCheck className="btn-icon icon-start !mr-0" />
          </Button>
        </div>
      )}
    </div>
  )
}
