import { Nachislenies } from './nachislenie'
import { NachislenieTabOptions, useNachislenieTab } from './nachislenie-tabs'
import { PremyaMatPomosh } from './premya-mat-pomosh'
import { TabelsView } from './tabel'

const NachisleniePage = () => {
  const [tabValue] = useNachislenieTab()

  return (
    <div className="flex-1 overflow-hidden">
      {tabValue === NachislenieTabOptions.Tabel ? <TabelsView /> : null}
      {tabValue === NachislenieTabOptions.Nachislenie ? <Nachislenies /> : null}
      {tabValue === NachislenieTabOptions.PremyaMatPomosh ? <PremyaMatPomosh /> : null}
    </div>
  )
}

export default NachisleniePage
