import type { FC } from 'react'

import { Document, Page } from '@react-pdf/renderer'

import { Header } from './components/header'

export const WorkTripReport: FC<{
  docDate: string
  startDate: string
  endDate: string
  workDays: number
  daySumma: number
  subSchet: string
  regionName: string
  summa: number
  bhm: number
  podotchetRayon: string
  podotchetName: string
  podotchetPosition: string
  podotchetRank: string
  destinationRegion: number
}> = () => {
  return (
    <Document>
      <Page>
        <Header />
      </Page>
    </Document>
  )
}
