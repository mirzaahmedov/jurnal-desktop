import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import type { EditorComponentType } from './types'
import { createSmetaGrafikSpravochnik } from '@renderer/app/region-admin/smeta-grafik/service'
import { formatNumber } from '@renderer/common/lib/format'

export const createSmetaGrafikEditor = <
  T extends { smeta_grafik_id?: number }
>(): EditorComponentType<T> => {
  const Editor: EditorComponentType<T> = ({ tabIndex, id, row, errors, onChange }) => {
    const smetaSpravochnik = useSpravochnik(
      createSmetaGrafikSpravochnik({
        value: row.smeta_grafik_id || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'smeta_grafik_id',
            payload: {
              ...row,
              smeta_grafik_id: value
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
        error={!!errors?.smeta_grafik_id}
        name="smeta_id"
        getInputValue={(selected) =>
          selected
            ? `${selected.smeta_number} - ${formatNumber(selected.itogo)} so'm - ${selected.smeta_name}`
            : '-'
        }
      />
    )
  }

  Editor.displayName = 'SmetaEditor'

  return Editor
}
