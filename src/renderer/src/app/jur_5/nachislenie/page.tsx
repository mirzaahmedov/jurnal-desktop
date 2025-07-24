import { Nachislenies } from './nachislenie'
import { NachislenieTabOptions, useNachislenieTab } from './nachislenie-tabs'
import { Reports } from './reports/reports'
import { TabelsView } from './tabel'
import { Vedemosts } from './vedemost/vedemost'

const NachisleniePage = () => {
  const [tabValue] = useNachislenieTab()

  return (
    <div className="flex-1 overflow-hidden">
      {tabValue === NachislenieTabOptions.Tabel ? <TabelsView /> : null}
      {tabValue === NachislenieTabOptions.Nachislenie ? <Nachislenies /> : null}
      {tabValue === NachislenieTabOptions.Reports ? <Reports /> : null}
      {tabValue === NachislenieTabOptions.Vedemost ? <Vedemosts /> : null}
    </div>
  )
}

export default NachisleniePage
