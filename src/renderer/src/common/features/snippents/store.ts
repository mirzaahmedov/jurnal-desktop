import type { Snippet } from './config'
import type { Dispatch, SetStateAction } from 'react'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SnippetsMap = Record<string, Snippet[]>

export interface SnippetsStore {
  snippets: SnippetsMap

  setSnippets: Dispatch<SetStateAction<SnippetsMap>>
}

export const useSnippetsStore = create(
  persist<SnippetsStore>(
    (set, get) => ({
      snippets: {},
      setSnippets(setter) {
        if (typeof setter === 'function') {
          set({ snippets: setter(get().snippets) })
          return
        }
        set({ snippets: setter })
      }
    }),
    {
      name: 'snippets'
    }
  )
)
