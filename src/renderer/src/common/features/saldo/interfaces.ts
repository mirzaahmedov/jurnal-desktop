export enum SaldoNamespace {
  JUR_1 = 'JUR_1',
  JUR_2 = 'JUR_2',
  JUR_3 = 'JUR_3',
  JUR_4 = 'JUR_4',
  JUR_7 = 'JUR_7'
}

export interface MonthValue {
  year: number
  month: number
  schet_id?: number
}

export interface SaldoControllerStore {
  queuedMonths: Record<SaldoNamespace, MonthValue[]>
  clearQueue: (ns: SaldoNamespace) => void
  enqueueMonth: (ns: SaldoNamespace, ...values: MonthValue[]) => void
  dequeueMonth: (ns: SaldoNamespace, ...values: MonthValue[]) => MonthValue[]
}
