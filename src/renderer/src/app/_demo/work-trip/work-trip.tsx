import type { Podpis, WorkTripChild, WorkTripRoad } from '@/common/models'
import type { FC } from 'react'

import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

import { Details } from './components/details'
import { Header } from './components/header'

registerFonts()

export const WorkTripReport: FC<{
  provodki: WorkTripChild[]
  regionName: string
  workerPosition: string
  workerRank: string
  workerFIO: string
  podpis: Podpis[]
  roads: WorkTripRoad[]
}> = (props) => {
  const { provodki, regionName, workerPosition, workerRank, workerFIO, podpis, roads } = props

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <Header
          provodki={provodki}
          regionName={regionName}
          podpis={podpis}
        />
        <Details
          regionName={regionName}
          workerPosition={workerPosition}
          workerRank={workerRank}
          workerFIO={workerFIO}
          roads={roads}
        />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tinos',
    fontSize: 10,
    paddingHorizontal: 20,
    paddingVertical: 20
  }
})
