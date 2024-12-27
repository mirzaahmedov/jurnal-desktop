import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import type { EditorComponentType } from './types'
import { createSmetaSpravochnik } from '@/app/super-admin/smeta'

export const createSmetaEditor = <T extends { smeta_id?: number }>(): EditorComponentType<T> => {
  const Editor: EditorComponentType<T> = ({ tabIndex, id, row, errors, onChange }) => {
    const smetaSpravochnik = useSpravochnik(
      createSmetaSpravochnik({
        value: row.smeta_id || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'smeta_id',
            payload: {
              ...row,
              smeta_id: value
            }
          })
        }
      })
    )
    return (
      <SpravochnikInput
        {...smetaSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.smeta_id}
        name="smeta_id"
        getInputValue={(selected) =>
          selected ? `${selected.smeta_number} - ${selected.smeta_name}` : '-'
        }
      />
    )
  }

  Editor.displayName = 'SmetaEditor'

  return Editor
}
