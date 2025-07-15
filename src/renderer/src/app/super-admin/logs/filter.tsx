import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { LogType } from '@/common/models'

import { useLogType } from './hooks'

const FilterOptions = [
  {
    label: 'Получить',
    value: LogType.GET
  },
  {
    label: 'Создать',
    value: LogType.POST
  },
  {
    label: 'Обновить',
    value: LogType.PUT
  },
  {
    label: 'Удалить',
    value: LogType.DELETE
  }
]

export const LogFilters = () => {
  const [type, setType] = useLogType()
  return (
    <div className="px-10">
      <div className="max-w-md">
        <JollySelect
          selectedKey={type}
          onSelectionChange={(value) => setType(value as LogType)}
          items={FilterOptions}
          placeholder="Filter by type"
        >
          {(item) => <SelectItem id={item.value}>{item.label}</SelectItem>}
        </JollySelect>
      </div>
    </div>
  )
}
