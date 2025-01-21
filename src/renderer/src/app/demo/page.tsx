import { DownloadFile } from './download-file'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const DemoPage = () => {
  const { main_schet_id, budjet_id } = useRequisitesStore()

  return (
    <main>
      <h1>Demo page</h1>

      <div className="flex items-center gap-5">
        <DownloadFile
          fileName={`дебитор-кредитор_отчет-21-01-2025.xlsx`}
          url="organization/monitoring/prixod/rasxod"
          params={{
            main_schet_id,
            budjet_id,
            to: '2025-01-01',
            operatsii: '159',
            excel: true
          }}
          buttonText="Дебитор / Кредитор отчет"
        />
      </div>
    </main>
  )
}

export default DemoPage
