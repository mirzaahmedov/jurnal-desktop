import type { EditorComponent } from './interfaces'

import { DatePicker } from '@/common/components'

export const createDateEditor = <T extends { responsible_id?: number }>(params: {
  key: string
}): EditorComponent<T> => {
  return ({ tabIndex, errors, value, onChange }) => {
    return (
      <DatePicker
        editor
        tabIndex={tabIndex}
        value={value as any}
        onChange={onChange}
        error={!!errors?.[params.key]}
      />
    )
  }
}
