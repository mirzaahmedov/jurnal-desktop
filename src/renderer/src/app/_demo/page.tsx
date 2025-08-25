import { PDFViewer } from '@react-pdf/renderer'

import { usePodpis } from '@/common/features/podpis'
import { parseDate } from '@/common/lib/date'
import { PodpisTypeDocument } from '@/common/models'

import { useMainSchetQuery } from '../region-spravochnik/main-schet/use-main-schet-query'
import { workTrip } from './demo'
import { WorkTripReport } from './work-trip/work-trip'

const DemoPage = () => {
  const mainSchetQuery = useMainSchetQuery()
  const podpis = usePodpis(PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA)

  return (
    <div className="flex-1">
      <PDFViewer className="w-full h-full">
        <WorkTripReport
          provodki={workTrip.childs ?? []}
          roads={workTrip.road ?? []}
          workerPosition={workTrip.worker.position}
          workerRank={workTrip.worker.rank ?? ''}
          workerFIO={workTrip.worker.name}
          regionName={mainSchetQuery.data?.data?.tashkilot_nomi ?? ''}
          podpis={podpis}
          year={parseDate(workTrip.doc_date).getFullYear()}
        />
      </PDFViewer>
    </div>
  )
}

export default DemoPage
