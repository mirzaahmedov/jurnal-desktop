import type { CellFocusedEvent, Column } from 'ag-grid-community'
import type { CustomCellRendererProps } from 'ag-grid-react'
import type { UseFormReturn } from 'react-hook-form'

import { type FC, type MutableRefObject, useCallback, useEffect, useRef } from 'react'

import { cva } from 'class-variance-authority'

export interface EditorProps extends CustomCellRendererProps {
  originalIndex: number
  form: UseFormReturn<any>
  arrayField: string
  className?: string
  readOnly?: boolean
  disabled?: boolean
  inputRef: MutableRefObject<HTMLInputElement | undefined>
}
export const createEditor = <T extends object = {}>(
  comp: FC<EditorProps & T>
): FC<CustomCellRendererProps> => {
  return (props) => {
    const originalIndex = props.data?.__originalIndex
    const { rowIndex } = props.node
    const { form, arrayField } = props.context
    const { api, colDef } = props

    const inputRef = useRef<HTMLInputElement>()

    const onCellFocused = useCallback(
      (event: CellFocusedEvent) => {
        if (
          rowIndex === event.rowIndex &&
          (event.column as Column<any>).getColId() === colDef?.field
        ) {
          inputRef.current?.focus()
        }
      },
      [rowIndex, colDef]
    )

    useEffect(() => {
      if (api) {
        api.addEventListener('cellFocused', onCellFocused)
      }
      return () => {
        if (api) {
          api.removeEventListener('cellFocused', onCellFocused)
        }
      }
    }, [onCellFocused, api])

    return comp({
      ...props,
      inputRef,
      form,
      arrayField,
      originalIndex
    } as EditorProps & T)
  }
}

export const inputVariants = cva('inline-block bg-transparent w-full h-10 px-4 focus:outline-none')
