export namespace ActualExpences {
  export interface Summa {
    debet_sum: number
    kredit_sum: number
  }

  export interface ActualExpenseReport {
    id: number
    type_document: string
    month: number
    year: number
    summa: Summa
  }
}
