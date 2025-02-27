import { useLocationState } from '@renderer/common/hooks'

import { SpravochnikTypeSelect } from './spravochnik-type-select'

export const SpravochnikFilters = () => {
  const [typeCode, setTypeCode] = useLocationState<undefined | number>('type')
  return (
    <div className="flex items-center justify-start px-10">
      <SpravochnikTypeSelect
        value={typeCode}
        onChange={setTypeCode}
      />
    </div>
  )
}
