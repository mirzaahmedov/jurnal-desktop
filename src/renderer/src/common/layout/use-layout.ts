import { useLayoutStore } from './store'

export const useLayout = () => useLayoutStore((store) => store.setLayout)
