import { Nachislenies } from './nachislenie'
import { NachislenieTabOptions, useNachislenieTab } from './nachislenie-tabs'
import { PremyaMatPomosh } from './other-vedemost'
import { ZarplataPodpisPage } from './podpis/page'
import { NachislenieReports } from './reports'
import { TabelsView } from './tabel'

const NachisleniePage = () => {
  const [tabValue] = useNachislenieTab()

  return (
    <div className="flex-1 overflow-hidden">
      {tabValue === NachislenieTabOptions.Tabel ? <TabelsView /> : null}
      {tabValue === NachislenieTabOptions.Nachislenie ? <Nachislenies /> : null}
      {tabValue === NachislenieTabOptions.OtherVedemost ? <PremyaMatPomosh /> : null}
      {tabValue === NachislenieTabOptions.Reports ? <NachislenieReports /> : null}
      {tabValue === NachislenieTabOptions.Podpis ? <ZarplataPodpisPage /> : null}
    </div>
  )
}

export default NachisleniePage
