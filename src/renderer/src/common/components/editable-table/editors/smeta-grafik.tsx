import type { EditorComponent } from './interfaces'

import { useEffect } from 'react'

import { createSmetaGrafikSpravochnik } from '@/app/region-spravochnik/smeta-grafik/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'

export const createSmetaGrafikEditor = <
  T extends { smeta_grafik_id?: number }
>(): EditorComponent<T> => {
  const Editor: EditorComponent<T> = ({
    tabIndex,
    errors,
    id,
    row,
    value,
    onChange,
    setState,
    validate,
    ...props
  }) => {
    const smetaSpravochnik = useSpravochnik(
      createSmetaGrafikSpravochnik({
        value: value as number | undefined,
        onChange: (value) => {
          if (
            validate &&
            !validate({ id, key: 'smeta_grafik_id', payload: { ...row, smeta_grafik_id: value } })
          ) {
            smetaSpravochnik.clear()
            return
          }
          onChange?.(value)
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
