import { useCallback } from 'react'

import { useLocation } from 'react-router-dom'
import { create } from 'zustand'

type State = Record<string, unknown>
type StateSetter<T> = T | ((prev: T) => T)
export interface LocationStore {
  values: Record<string, State>
  setValues: (pathname: string, setter: StateSetter<State>) => void
}

// Todo: remove persist
const useLocationStore = create<LocationStore>((set, get) => ({
  values: {},
  setValues(pathname, setter) {
    set({
      values: {
        ...get().values,
        [pathname]: typeof setter === 'function' ? setter(get().values[pathname]) : setter
      }
    })
  }
}))

export const useLocationState = <T = undefined>(
  key: string,
  defaultState?: T
): [T, (setter: StateSetter<T>) => void] => {
  const pathname = useLocation().pathname

  const state = useLocationStore((store) => store.values[pathname]?.[key] ?? defaultState)
  const setValues = useLocationStore((store) => store.setValues)

  const setState = useCallback(
    (setter: StateSetter<T | undefined>) => {
      setValues(pathname, (prev) => ({
        ...prev,
        [key]:
          typeof setter === 'function'
            ? (setter as (value: T) => void)((prev?.[key] ?? defaultState) as T)
            : setter
      }))
    },
    [setValues, pathname, key]
  )

  return [state as T, setState as (setter: StateSetter<T>) => void] as const
}
