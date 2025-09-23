import type { CustomCellEditorProps } from 'ag-grid-react'
import type { FC } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { type EditorContext, EditorInput } from './input'

export const NumberEditor: FC<CustomCellEditorProps<unknown, unknown, EditorContext>> = (props) => {
  const { rowIndex, colDef, onKeyDown, onValueChange, data } = props
  const { arrayName } = props.context
  const { control } = useFormContext()
  const { field: fieldName } = colDef
  const { _originalIndex } = (data as { _originalIndex: string }) || {}

  const index = _originalIndex ? Number(_originalIndex) : rowIndex

  return (
    <Controller
      control={control}
      name={`${arrayName}.${index}.${fieldName}`}
      render={({ field }) => {
        return (
          <EditorInput
            isNumeric
            disabled={field.disabled}
            inputRef={field.ref}
            value={field.value}
            onBlur={() => {
              field.onBlur()
            }}
            onKeyDown={onKeyDown}
            onValueChange={(value) => {
              field.onChange(value)
              onValueChange(value)
            }}
            rowIndex={index}
            context={{
              arrayName
            }}
          />
        )
      }}
    />
  )
}
