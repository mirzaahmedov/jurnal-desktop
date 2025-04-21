import { Trans } from 'react-i18next'

import { type FinancialReceiptProvodka, FinancialReceiptProvodkaType } from '@/common/models'

export const defaultValues = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: [] as FinancialReceiptProvodka[]
}

export type FinancialReceiptFormValues = typeof defaultValues

export const FinancialReceiptProvodkaTypeLabels = {
  [FinancialReceiptProvodkaType.bank_prixod_child]: <Trans ns="app">pages.bank_prixod</Trans>,
  [FinancialReceiptProvodkaType.bank_rasxod_child]: <Trans ns="app">pages.bank_rasxod</Trans>,
  [FinancialReceiptProvodkaType.kassa_prixod_child]: <Trans ns="app">pages.kassa_prixod</Trans>,
  [FinancialReceiptProvodkaType.kassa_rasxod_child]: <Trans ns="app">pages.kassa_rasxod</Trans>,
  [FinancialReceiptProvodkaType.kursatilgan_hizmatlar_jur152_child]: (
    <Trans ns="app">pages.service</Trans>
  ),
  [FinancialReceiptProvodkaType.document_prixod_jur7_child]: (
    <Trans ns="app">pages.jur7_prixod</Trans>
  ),
  [FinancialReceiptProvodkaType.document_rasxod_jur7_child]: (
    <Trans ns="app">pages.jur7_rasxod</Trans>
  ),
  [FinancialReceiptProvodkaType.document_internal_jur7_child]: (
    <Trans ns="app">pages.jur7_internal</Trans>
  )
}
