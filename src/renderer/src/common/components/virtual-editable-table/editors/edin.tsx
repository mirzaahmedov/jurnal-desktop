import type { EditorComponent } from './interfaces'

import { EdinSelect } from '@/common/components/edin-select'

export const createEdinEditor = <T extends { responsible_id?: number }>(params: {
  key: string
}): EditorComponent<T> => {
  return ({ tabIndex, errors, value, onChange }) => {
    return (
      <EdinSelect
        selectedKey={value as any}
        onSelectionChange={onChange}
        error={!!errors?.[params.key]}
        tabIndex={tabIndex}
      />
    )
  }
}
