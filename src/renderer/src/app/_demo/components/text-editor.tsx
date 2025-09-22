import type { CustomCellEditorProps } from 'ag-grid-react'
import type { FC } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { type EditorContext, EditorInput } from './input'

export const TextEditor: FC<CustomCellEditorProps<unknown, unknown, EditorContext>> = (props) => {
  const { rowIndex, colDef, onKeyDown, onValueChange } = props
  const { arrayName } = props.context
  const { control } = useFormContext()
  const { field: fieldName } = colDef

  return (
    <Controller
      control={control}
      name={`${arrayName}.${rowIndex}.${fieldName}`}
      render={({ field }) => (
        <EditorInput
          disabled={field.disabled}
          inputRef={field.ref}
          value={field.value}
          onBlur={() => {
            field.onBlur()
          }}
          onKeyDown={onKeyDown}
          onValueChange={(value) => {
            field.onChange(value)
            onValueChange(field.value)
          }}
          rowIndex={rowIndex}
          context={{
            arrayName
          }}
        />
      )}
    />
  )
}
