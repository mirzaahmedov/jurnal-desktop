import type { ReactNode } from 'react'

import { Trans } from 'react-i18next'

export const NachislenieQueryKeys = {
  getAll: 'nachislenie/all'
}

export const UderjanieQueryKeys = {
  getAll: 'nachislenie/all',
  getAliment: 'nachislenie/aliment'
}

export interface UderjanieType {
  key: 'rootObjectNachislenie' | 'rootObjectUderjanie' | 'rootDopOplata'
  name: ReactNode
}
export const uderjanieTypes: UderjanieType[] = [
  { key: 'rootObjectNachislenie', name: <Trans>nachislenie</Trans> },
  { key: 'rootObjectUderjanie', name: <Trans>uderjanie</Trans> },
  { key: 'rootDopOplata', name: <Trans>doplata</Trans> }
]
