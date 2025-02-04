import { useCallback } from 'react'

import { useLocation } from 'react-router-dom'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ValueSetter<T> = T | ((prev: T) => T)
export interface LocationStore<T> {
  state: Record<string, T>
  setState: (pathname: string, setter: ValueSetter<T>) => void
}

export const createLocationStore = <T extends Record<string, unknown | string | number>>(
  name: string
) => {
  return create(
    persist<LocationStore<T>>(
      (set, get) => ({
        state: {},
        setState(pathname, setter) {
          set({
            state: {
              ...get().state,
              [pathname]: typeof setter === 'function' ? setter(get().state[pathname]) : setter
            }
          })
        }
      }),
      {
        name
      }
    )
  )
}

export const useLocationState = <T>(store: LocationStore<T>, defaultState?: T) => {
  const location = useLocation()
  const pathname = location.pathname

  const state = store.state[pathname]
  const setState = useCallback(
    (value: ValueSetter<T>) => {
      store.setState(pathname, value)
    },
    [pathname, store.setState]
  )

  return [state ?? defaultState, setState] as const
}
