import type { CellRenderProps } from '../types'

import { EditorInput } from './input'

export const TextEditor = <T extends object>({ inputRef, value, onChange }: CellRenderProps<T>) => {
  return (
    <EditorInput
      ref={inputRef}
      value={value as string}
      onChange={onChange}
    />
  )
}
