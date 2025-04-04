import type { EditorComponentType } from './types'

import { useEffect } from 'react'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createSmetaEditor = <T extends { smeta_id?: number }>(): EditorComponentType<T> => {
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
      createSmetaSpravochnik({
        value: row.smeta_id || undefined,
        onChange: (value) => {
          if (
            validate &&
            !validate({ id, key: 'smeta_id', payload: { ...row, smeta_id: value } })
          ) {
            smetaSpravochnik.clear()
            return
          }
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
