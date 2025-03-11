import type { Snippet } from './config'

import { useCallback } from 'react'

import { useSnippetsStore } from './store'

export interface UseSnippetsOptions {
  ns: string
}
export interface UseSnippetsReturn {
  snippets: Snippet[]
  addSnippet: (snippet: Snippet) => void
  removeSnippet: (index: number) => void
}
export const useSnippets = ({ ns }: UseSnippetsOptions) => {
  const { snippets, setSnippets } = useSnippetsStore()

  const addSnippet = useCallback(
    (snippet: Snippet) => {
      setSnippets((prev) => {
        if (!(ns in prev) || !Array.isArray(prev[ns])) {
          prev[ns] = []
        }
        prev[ns].push(snippet)
        return prev
      })
    },
    [ns]
  )

  const removeSnippet = useCallback(
    (index: number) => {
      setSnippets((prev) => {
        if (!(ns in prev) || !Array.isArray(prev[ns])) {
          return prev
        }
        prev[ns] = prev[ns].filter((_, i) => i !== index)
        return prev
      })
    },
    [ns]
  )

  return {
    snippets: snippets?.[ns] ?? [],
    addSnippet,
    removeSnippet
  }
}
