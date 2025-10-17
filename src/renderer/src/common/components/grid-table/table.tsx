import type { FC } from 'react'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'

ModuleRegistry.registerModules([AllCommunityModule])

export const GridTable: FC<AgGridReactProps> = (props) => {
  return <AgGridReact {...props} />
}
