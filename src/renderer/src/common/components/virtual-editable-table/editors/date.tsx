import type { EditorComponent } from './interfaces'

import { JollyDatePicker } from '@/common/components/jolly-date-picker'

export const createDateEditor = <T extends { responsible_id?: number }>(params: {
  key: string
}): EditorComponent<T> => {
  return ({ tabIndex, errors, value, onChange }) => {
    return (
      <JollyDatePicker
        editor
        tabIndex={tabIndex}
        value={value as any}
        onChange={onChange}
        error={!!errors?.[params.key]}
      />
    )
  }
}
