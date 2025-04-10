import { Trans } from 'react-i18next'

import { type JUR8MonitorChild, JUR8MonitorChildType } from '@/common/models'

export const defaultValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: [] as JUR8MonitorChild[]
}

export const JUR8MonitorChildTypeLabels = {
  [JUR8MonitorChildType.bank_prixod_child]: <Trans ns="app">pages.bank_prixod</Trans>,
  [JUR8MonitorChildType.bank_rasxod_child]: <Trans ns="app">pages.bank_rasxod</Trans>,
  [JUR8MonitorChildType.kassa_prixod_child]: <Trans ns="app">pages.kassa_prixod</Trans>,
  [JUR8MonitorChildType.kassa_rasxod_child]: <Trans ns="app">pages.kassa_rasxod</Trans>,
  [JUR8MonitorChildType.kursatilgan_hizmatlar_jur152_child]: <Trans ns="app">pages.service</Trans>,
  [JUR8MonitorChildType.document_prixod_jur7_child]: <Trans ns="app">pages.jur7_prixod</Trans>,
  [JUR8MonitorChildType.document_rasxod_jur7_child]: <Trans ns="app">pages.jur7_rasxod</Trans>,
  [JUR8MonitorChildType.document_internal_jur7_child]: <Trans ns="app">pages.jur7_internal</Trans>
}
