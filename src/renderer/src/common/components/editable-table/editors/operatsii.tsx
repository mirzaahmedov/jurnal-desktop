import type { Operatsii, TypeSchetOperatsii } from '@/common/models'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { useEffect, useLayoutEffect, useRef } from 'react'

import type { EditorComponentType } from './types'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'

type OperatsiiEditorOptions = {
  type_schet: TypeSchetOperatsii
}
export const createOperatsiiEditor = <T extends { spravochnik_operatsii_id?: number }>({
  type_schet
}: OperatsiiEditorOptions): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange, params }) => {
    const paramsRef = useRef<{ onChangeOperatsii: (selected: Operatsii | undefined) => void }>(
      params as any
    )

    useLayoutEffect(() => {
      paramsRef.current = params as any
    })

    const operatsiiSpravochnik = useSpravochnik(
      createOperatsiiSpravochnik({
        value: row.spravochnik_operatsii_id || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'spravochnik_operatsii_id',
            payload: {
              ...row,
              spravochnik_operatsii_id: value
            }
          })
        },
        params: {
          type_schet
        }
      })
    )

    useEffect(() => {
      paramsRef.current?.onChangeOperatsii?.(operatsiiSpravochnik.selected)
    }, [operatsiiSpravochnik.selected])

    return (
      <SpravochnikInput
        {...operatsiiSpravochnik}
        editor
        readOnly
        tabIndex={tabIndex}
        error={!!errors?.spravochnik_operatsii_id}
        name="spravochnik_operatsii_id"
        getInputValue={(selected) =>
          selected ? `${selected.schet} / ${selected.sub_schet} - ${selected.name}` : '-'
        }
      />
    )
  }
}
