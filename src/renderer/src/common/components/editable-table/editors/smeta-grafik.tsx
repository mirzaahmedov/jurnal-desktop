import type { EditorComponentType } from './types'

import { useEffect } from 'react'

import { createSmetaGrafikSpravochnik } from '@renderer/app/region-spravochnik/smeta-grafik/service'
import { formatNumber } from '@renderer/common/lib/format'

import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createSmetaGrafikEditor = <
  T extends { smeta_grafik_id?: number }
>(): EditorComponentType<T> => {
  const Editor: EditorComponentType<T> = ({
    tabIndex,
    id,
    row,
    errors,
    onChange,
    setState,
    validate,
    ...props
  }) => {
    const smetaSpravochnik = useSpravochnik(
      createSmetaGrafikSpravochnik({
        value: row.smeta_grafik_id || undefined,
        onChange: (value) => {
          if (
            validate &&
            !validate({ id, key: 'smeta_grafik_id', payload: { ...row, smeta_grafik_id: value } })
          ) {
            smetaSpravochnik.clear()
            return
          }
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

    useEffect(() => {
      setState({
        smeta_grafik: smetaSpravochnik.selected
      })
    }, [smetaSpravochnik.selected])

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
        {...props}
      />
    )
  }

  Editor.displayName = 'SmetaEditor'

  return Editor
}
