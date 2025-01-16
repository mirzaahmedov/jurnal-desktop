import { useSearchParams } from 'react-router-dom'

export const useSearch = () => {
  const [searchParams] = useSearchParams()

  return {
    search: searchParams.get('search') || undefined
  }
}
