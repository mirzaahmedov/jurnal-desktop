import { Document, Page } from '@react-pdf/renderer'

import { Header } from './components/header'

export const WorkTripReport = () => {
  return (
    <Document>
      <Page>
        <Header />
      </Page>
    </Document>
  )
}
