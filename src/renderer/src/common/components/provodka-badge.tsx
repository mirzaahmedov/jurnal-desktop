import type { ReactNode } from 'react'

import { Trans } from 'react-i18next'

import { ProvodkaType } from '@/common/models'

import { Badge } from './ui/badge'

// const statusColors = [
//   'hsl(210, 25%, 55%)', // dusty blue
//   'hsl(5, 35%, 50%)', // muted red
//   'hsl(30, 30%, 60%)', // soft orange / brown
//   'hsl(120, 25%, 50%)', // moss green
//   'hsl(270, 20%, 60%)', // dusty violet
//   'hsl(50, 25%, 60%)', // desaturated yellow
//   'hsl(0, 15%, 50%)', // warm gray / muted maroon
//   'hsl(180, 20%, 55%)', // soft teal
//   'hsl(300, 15%, 55%)', // faded plum
//   'hsl(90, 20%, 50%)', // olive
//   'hsl(160, 20%, 52%)', // pale jade
//   'hsl(200, 15%, 60%)', // cool gray-blue
//   'hsl(35, 25%, 55%)', // muddy amber
//   'hsl(240, 20%, 50%)' // muted navy
// ]

// function generateFinancePalette(n: number): string[] {
//   const baseHues = [0, 30, 60, 90, 120, 160, 200, 240, 270, 300] // earth, greens, neutrals
//   const colors: string[] = []

//   for (let i = 0; i < n; i++) {
//     const hue = baseHues[i % baseHues.length] + (Math.random() * 10 - 5) // small hue variation
//     const saturation = 20 + Math.random() * 10 // muted
//     const lightness = 50 + Math.random() * 10 // medium-light

//     colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
//   }

//   return colors
// }

// function generateMutedColors(n: number): string[] {
//   const colors: string[] = []

//   for (let i = 0; i < n; i++) {
//     const hue = Math.floor((360 / n) * i) // Spread hues evenly
//     const saturation = 35 + Math.random() * 15 // 35–50%
//     const lightness = 50 + Math.random() * 10 // 50–60%
//     colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
//   }

//   return colors
// }

export interface ProvodkaBadgeProps {
  type: ProvodkaType
}
export const ProvodkaBadge = ({ type }: ProvodkaBadgeProps) => {
  const options = getProvodkaBadgeOptions(type)
  return (
    <Badge
      variant="secondary"
      style={{ backgroundColor: options.color }}
    >
      {options.name}
    </Badge>
  )
}

export interface ProvodkaBadgeOptions {
  name: ReactNode
  color: string
}
export const getProvodkaBadgeOptions = (type: ProvodkaType): ProvodkaBadgeOptions => {
  const colors = []
  // const colors = generateFinancePalette(Object.keys(ProvodkaType).length)
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
    case ProvodkaType.AVANS:
      return {
        name: <Trans>provodka_type.avans</Trans>,
        color: colors[6]
      }
    case ProvodkaType.JUR7_PRIXOD:
      return {
        name: <Trans>provodka_type.jur7_prixod</Trans>,
        color: colors[7]
      }
    case ProvodkaType.JUR7_RASXOD:
      return {
        name: <Trans>provodka_type.jur7_rasxod</Trans>,
        color: colors[8]
      }
    case ProvodkaType.JUR7_INTERNAL:
      return {
        name: <Trans>provodka_type.jur7_internal</Trans>,
        color: colors[9]
      }
    case ProvodkaType.PODOTCHET_SALDO_RASXOD:
      return {
        name: <Trans>provodka_type.saldo_rasxod</Trans>,
        color: colors[10]
      }
    case ProvodkaType.PODOTCHET_SALDO_PRIXOD:
      return {
        name: <Trans>provodka_type.saldo_prixod</Trans>,
        color: colors[11]
      }
    case ProvodkaType.ORGAN_SALDO_RASXOD:
      return {
        name: <Trans>provodka_type.saldo_rasxod</Trans>,
        color: colors[12]
      }
    case ProvodkaType.ORGAN_SALDO_PRIXOD:
      return {
        name: <Trans>provodka_type.saldo_prixod</Trans>,
        color: colors[13]
      }
    case ProvodkaType.AVANS_WORK_TRIP:
      return {
        name: <Trans>provodka_type.work_trip</Trans>,
        color: colors[6]
      }

    default:
      return {
        name: '',
        color: ''
      }
  }
}
