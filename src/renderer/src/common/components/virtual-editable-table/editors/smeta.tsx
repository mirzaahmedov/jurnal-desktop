import type { EditorComponent } from './interfaces'

import { useEffect } from 'react'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createSmetaEditor = <T extends object>(): EditorComponent<T, any> => {
  const Editor: EditorComponent<T, any> = ({
    tabIndex,
    column,
    index: id,
    row,
    error,
    value,
    onChange,
    setState,
    validate
  }) => {
    const smetaSpravochnik = useSpravochnik(
      createSmetaSpravochnik({
        value: value as number | undefined,
        onChange: (value) => {
          if (
            validate &&
            !validate({
              id,
              key: column.key as keyof T,
              values: { ...row, [column.key as keyof T]: value } as T
            })
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
        error={!!error}
        name="smeta_id"
        getInputValue={(selected) => (selected ? `${selected.smeta_number}` : '-')}
      />
    )
  }

  Editor.displayName = 'SmetaEditor'

  return Editor
}
