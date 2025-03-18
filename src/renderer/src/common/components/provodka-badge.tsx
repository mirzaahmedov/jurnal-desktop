import type { ReactNode } from 'react'

import { Trans } from 'react-i18next'

import { getColors } from '@/common/lib/color'
import { ProvodkaType } from '@/common/models'

import { Badge } from './ui/badge'

export interface ProvodkaBadgeProps {
  type: ProvodkaType
}
export const ProvodkaBadge = ({ type }: ProvodkaBadgeProps) => {
  const options = getProvodkaBadgeOptions(type)
  return <Badge style={{ backgroundColor: options.color }}>{options.name}</Badge>
}

export interface ProvodkaBadgeOptions {
  name: ReactNode
  color: string
}
export const getProvodkaBadgeOptions = (type: ProvodkaType): ProvodkaBadgeOptions => {
  const colors = getColors(Object.keys(ProvodkaType).length)
  switch (type) {
    case ProvodkaType.BANK_PRIXOD:
      return {
        name: <Trans>provodka_type.bank_prixod</Trans>,
        color: colors[0]
      }
    case ProvodkaType.BANK_RASXOD:
      return {
        name: <Trans>provodka_type.bank_rasxod</Trans>,
        color: colors[1]
      }
    case ProvodkaType.KASSA_PRIXOD:
      return {
        name: <Trans>provodka_type.kassa_prixod</Trans>,
        color: colors[2]
      }
    case ProvodkaType.KASSA_RASXOD:
      return {
        name: <Trans>provodka_type.kassa_rasxod</Trans>,
        color: colors[3]
      }
    case ProvodkaType.SHOW_SERVICE:
      return {
        name: <Trans>provodka_type.show_service</Trans>,
        color: colors[4]
      }
    case ProvodkaType.AKT:
      return {
        name: <Trans>provodka_type.akt</Trans>,
        color: colors[5]
      }
    case ProvodkaType.JUR7_PRIXOD:
      return {
        name: <Trans>provodka_type.jur7_prixod</Trans>,
        color: colors[6]
      }
    case ProvodkaType.JUR7_RASXOD:
      return {
        name: <Trans>provodka_type.jur7_rasxod</Trans>,
        color: colors[7]
      }
    case ProvodkaType.JUR7_INTERNAL:
      return {
        name: <Trans>provodka_type.jur7_internal</Trans>,
        color: colors[8]
      }

    default:
      return {
        name: '',
        color: ''
      }
  }
}
