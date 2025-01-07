import { useSearchParams } from 'react-router-dom'

export type DateParams = {
  month: number
  year: number
}

export const useQueryDateParams = (name: string): DateParams => {
  const [searchParams] = useSearchParams()

  const date = searchParams.get(name)
  if (!date) {
    return { month: 0, year: 0 }
  }

  const [month, year] = date.split('-').map((value) => (isNaN(Number(value)) ? 0 : Number(value)))
  return { month, year }
}

export const serializeDateParams = ({ month, year }: DateParams) => {
  if (!month || !year) {
    return ''
  }
  return `${String(month).padStart(2, '0')}-${year}`
}

export const useQueryRegionId = () => {
  const [searchParams] = useSearchParams()
  const region_id = Number(searchParams.get('region_id'))
  if (isNaN(region_id)) {
    return { region_id: 0 }
  }
  return { region_id }
}

export const useQueryBudjetId = () => {
  const [searchParams] = useSearchParams()
  const budjet_id = Number(searchParams.get('budjet_id'))
  if (isNaN(budjet_id)) {
    return { budjet_id: 0 }
  }
  return { budjet_id }
}

export const useQueryTypeDocument = () => {
  const [searchParams] = useSearchParams()
  const type_document = searchParams.get('type_document')
  return { type_document }
}
