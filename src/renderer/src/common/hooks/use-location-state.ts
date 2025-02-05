import { useCallback } from 'react'

import { useLocation } from 'react-router-dom'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = Record<string, unknown>
type StateSetter<T> = T | ((prev: T) => T)
export interface LocationStore {
  values: Record<string, State>
  setValues: (pathname: string, setter: StateSetter<State>) => void
}

const useLocationStore = create(
  persist<LocationStore>(
    (set, get) => ({
      values: {},
      setValues(pathname, setter) {
        set({
          values: {
            ...get().values,
            [pathname]: typeof setter === 'function' ? setter(get().values[pathname]) : setter
          }
        })
      }
    }),
    {
      name: 'location-state'
    }
  )
)

export const useLocationState = <T = undefined>(
  key: string,
  defaultState?: T
): [T, (setter: StateSetter<T>) => void] => {
  const { pathname } = useLocation()
  const { setValues, values } = useLocationStore()

  const state = values[pathname]?.[key] ?? defaultState
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
