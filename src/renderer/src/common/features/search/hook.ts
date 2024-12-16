import { parseAsString, useQueryState } from 'nuqs'

export const useSearch = () => {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))

  return {
    search: search || undefined,
    setSearch
  }
}
