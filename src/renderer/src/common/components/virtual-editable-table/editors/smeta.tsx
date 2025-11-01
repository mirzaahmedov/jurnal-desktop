import type { EditorComponent } from './interfaces'
import type { Smeta } from '@/common/models'
import type { ArrayPath } from 'react-hook-form'

import { useEffect } from 'react'

import { Pressable } from 'react-aria-components'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

export const createSmetaEditor = <T extends { smeta_id?: number }, F extends ArrayPath<T>>({
  readOnly = false
}: {
  readOnly?: boolean
}): EditorComponent<T, F> => {
  const Editor: EditorComponent<T, F> = ({
    tabIndex,
    id,
    row,
    errors,
    value,
    params,
    onChange,
    setState,
    validate
  }) => {
    const smetaSpravochnik = useSpravochnik(
      createSmetaSpravochnik({
        value: value as number | undefined,
        onChange: (value, smeta) => {
          if (
            validate &&
            !validate({ id, key: 'smeta_id', payload: { ...row, smeta_id: value } })
          ) {
            smetaSpravochnik.clear()
            return
          }

          onChange?.(value)
          ;(params as { onSmetaChange: (rowIndex: number, meta?: Smeta) => void })?.onSmetaChange?.(
            id,
            smeta
          )
        }
      })
    )

    useEffect(() => {
      setState({
        smeta_grafik: smetaSpravochnik.selected
      })
    }, [smetaSpravochnik.selected])

    return (
      <TooltipTrigger delay={100}>
        <Pressable isDisabled={!smetaSpravochnik.selected}>
          <div>
            <SpravochnikInput
              {...smetaSpravochnik}
              open={readOnly ? undefined : smetaSpravochnik.open}
              clear={readOnly ? undefined : smetaSpravochnik.clear}
              editor
              readOnly
              tabIndex={tabIndex}
              error={!!errors?.smeta_id}
              name="smeta_id"
              getInputValue={(selected) => (selected ? `${selected.smeta_number}` : '-')}
            />
          </div>
        </Pressable>
        <Tooltip
          placement="right"
          className="bg-white text-foreground shadow-xl p-5 min-w-96 max-w-2xl"
        >
          <p className="text-sm">{smetaSpravochnik.selected?.smeta_name}</p>
        </Tooltip>
      </TooltipTrigger>
    )
  }

  Editor.displayName = 'SmetaEditor'

  return Editor
}
