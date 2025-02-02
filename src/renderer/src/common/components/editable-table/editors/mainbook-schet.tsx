import type { EditorComponentType } from './types'

import { createMainbookSchetSpravochnik } from '@renderer/app/super-admin/mainbook-schet/service'

import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createMainbookSchetEditor = <
  T extends { spravochnik_main_book_schet_id?: number }
>(): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange, validate, ...props }) => {
    const mainbookSchetSpravochnik = useSpravochnik(
      createMainbookSchetSpravochnik({
        value: row.spravochnik_main_book_schet_id || undefined,
        onChange: (value) => {
          if (
            validate &&
            !validate({
              id,
              key: 'spravochnik_main_book_schet_id',
              payload: {
                ...row,
                spravochnik_main_book_schet_id: value
              }
            })
          ) {
            mainbookSchetSpravochnik.clear()
            return
          }
          onChange?.({
            id,
            key: 'spravochnik_main_book_schet_id',
            payload: {
              ...row,
              spravochnik_main_book_schet_id: value
            }
          })
        }
      })
    )
    return (
      <SpravochnikInput
        {...mainbookSchetSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.spravochnik_main_book_schet_id}
        name="spravochnik_main_book_schet_id"
        getInputValue={(selected) => (selected ? `${selected.schet} - ${selected.name}` : '-')}
        {...props}
      />
    )
  }
}
