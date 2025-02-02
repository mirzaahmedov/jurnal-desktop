import { SelectField } from '@renderer/common/components'
import { LogType } from '@renderer/common/models'

import { useLogType } from './hooks'

const filterOptions = [
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

const LogFilter = () => {
  const [type, setType] = useLogType()
  return (
    <div className="px-10">
      <div className="max-w-md">
        <SelectField
          value={type}
          placeholder="Filter by type"
          onValueChange={(option) => setType(option as LogType)}
          options={filterOptions}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
        />
      </div>
    </div>
  )
}

export { LogFilter }
