import type { EditorComponent } from './interfaces'

import { useEffect } from 'react'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createSmetaEditor = <T extends { smeta_id?: number }>(): EditorComponent<T> => {
  const Editor: EditorComponent<T> = ({
    tabIndex,
    id,
    row,
    errors,
    value,
    onChange,
    setState,
    validate,
    ...props
  }) => {
    const smetaSpravochnik = useSpravochnik(
      createSmetaSpravochnik({
        value: value as number | undefined,
        onChange: (value) => {
          if (
            validate &&
            !validate({ id, key: 'smeta_id', payload: { ...row, smeta_id: value } })
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
        error={!!errors?.smeta_id}
        name="smeta_id"
        getInputValue={(selected) => (selected ? `${selected.smeta_number}` : '-')}
        {...props}
      />
    )
  }

  Editor.displayName = 'SmetaEditor'

  return Editor
}
