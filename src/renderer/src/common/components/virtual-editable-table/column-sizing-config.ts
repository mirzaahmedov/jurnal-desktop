// Advanced configuration options for dynamic column sizing

export interface ColumnSizingConfig {
  // Global settings
  enabled: boolean
  debounceDelay: number

  // Per-column settings
  columns: Record<
    string,
    {
      autoSize: boolean
      minWidth: number
      maxWidth: number
      padding: number
    }
  >

  // Measurement method
  measurementMethod: 'canvas' | 'dom'

  // Performance settings
  batchUpdates: boolean
  batchDelay: number
}

export const defaultColumnSizingConfig: ColumnSizingConfig = {
  enabled: true,
  debounceDelay: 150,
  columns: {
    smeta_id: {
      autoSize: true,
      minWidth: 200,
      maxWidth: 400,
      padding: 48
    },
    oy_1: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_2: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_3: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_4: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_5: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_6: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_7: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_8: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_9: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_10: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_11: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    oy_12: { autoSize: true, minWidth: 80, maxWidth: 150, padding: 24 },
    itogo: { autoSize: true, minWidth: 100, maxWidth: 200, padding: 32 }
  },
  measurementMethod: 'canvas',
  batchUpdates: true,
  batchDelay: 100
}

// Hook for managing column sizing
export const useColumnSizing = (config: Partial<ColumnSizingConfig> = {}) => {
  const finalConfig = { ...defaultColumnSizingConfig, ...config }

  return {
    config: finalConfig,
    shouldAutoSize: (columnId: string) =>
      finalConfig.enabled && finalConfig.columns[columnId]?.autoSize !== false,
    getColumnConfig: (columnId: string) => finalConfig.columns[columnId],
    isEnabled: finalConfig.enabled
  }
}
