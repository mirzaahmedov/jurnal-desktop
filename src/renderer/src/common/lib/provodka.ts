import { ProvodkaType } from '@/common/models'

export const getProvodkaURL = ({ type, id }: { type: ProvodkaType; id: number }) => {
  switch (type) {
    case ProvodkaType.BANK_RASXOD:
      return `/bank/rasxod/${id}`
    case ProvodkaType.BANK_PRIXOD:
      return `/bank/prixod/${id}`
    case ProvodkaType.KASSA_RASXOD:
      return `/kassa/rasxod/${id}`
    case ProvodkaType.KASSA_PRIXOD:
      return `/kassa/prixod/${id}`
    case ProvodkaType.SHOW_SERVICE:
      return `/organization/pokazat-uslugi/${id}`
    case ProvodkaType.AKT:
      return `/organization/akt/${id}`
    case ProvodkaType.AVANS:
      return `/accountable/advance-report/${id}`
    case ProvodkaType.JUR7_RASXOD:
      return `/journal-7/rasxod/${id}`
    case ProvodkaType.JUR7_PRIXOD:
      return `/journal-7/prixod/${id}`
    case ProvodkaType.JUR7_INTERNAL:
      return `/journal-7/internal/${id}`

    default:
      return ''
  }
}
