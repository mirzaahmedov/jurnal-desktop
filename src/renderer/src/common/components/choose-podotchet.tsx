import type { Podotchet } from '@/common/models'

import { CircleCheck, CircleX } from 'lucide-react'
import { Button } from '@/common/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type ChoosePodotchetProps = {
  selected?: Podotchet
  open: () => void
  clear: () => void
}
const ChoosePodotchet = (props: ChoosePodotchetProps) => {
  const { selected, open, clear } = props

  const elements = [
    {
      name: 'Регион',
      value: selected?.rayon
    }
  ]

  return (
    <div className="border-2 border-slate-100 rounded-xl flex flex-wrap justify-between items-center gap-20">
      {selected ? (
        <Popover>
          <PopoverTrigger>
            <div className="px-5 py-2.5 flex items-center gap-10">
              <h3 className="text-xs text-foreground/90 text-md leading-none font-bold">
                {selected.name}
              </h3>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Выбрать"
                  onClick={clear}
                  className="hover:text-destructive text-slate-400"
                >
                  <CircleX className="btn-icon icon-start !mr-0" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Выбрать"
                  onClick={open}
                  className="text-slate-400"
                >
                  <CircleCheck className="btn-icon icon-start !mr-0" />
                </Button>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-full max-w-md"
          >
            <ul className="text-xs space-y-1.5">
              {elements.map(({ name, value }) => (
                <li
                  key={name}
                  className="grid grid-cols-5 gap-2 text-slate-600"
                >
                  <span className="col-span-1 text-slate-500 font-medium">{name}</span>
                  <span className="col-span-4 font-bold text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="px-5 py-2.5 self-stretch flex items-center gap-10">
          <h6 className="text-sm text-slate-500">Выберите подотчетное лицо</h6>
          <Button
            variant="ghost"
            size="icon"
            title="Выбрать"
            onClick={open}
            className="text-slate-400"
          >
            <CircleCheck className="btn-icon icon-start !mr-0" />
          </Button>
        </div>
      )}
    </div>
  )
}

export { ChoosePodotchet }
export type { ChoosePodotchetProps }
