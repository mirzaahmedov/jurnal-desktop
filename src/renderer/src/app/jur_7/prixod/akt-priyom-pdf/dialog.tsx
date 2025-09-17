import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { useMainSchetQuery } from '@/app/region-spravochnik/main-schet/use-main-schet-query'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { GenerateFile } from '@/common/features/file'
import { usePodpis } from '@/common/features/podpis'
import { type MaterialPrixodProvodka, PodpisTypeDocument } from '@/common/models'

import { AktPriyomReport } from './akt-priyom'

export interface IMaterialAktPriyomStore {
  headerText: string
  setHeaderText: (values: string) => void
}
export const useMaterialAktPriyomStore = create(
  persist<IMaterialAktPriyomStore>(
    (set) => ({
      headerText: `Харид килинган моддий товарларни кабул килиш буйича комиссия раиси: Бошкарма бошлигининг уринбосари майор М.Мансуров, комиссия аъзолари; Шахсий хавфсизлик бўлими бош инспектори майор А.Толлиев, Хизмат ва жанговор тайоргарликни ташкил этиш бўлими бошлиги подполковник А.Айдаров, Радиацион, кимёовий ва тиббий-биологик мухофазани ташкил этиш бўлими бошлиги майор С.Шодиев, комиссия котиби; Моддий -техник таъминот бўлими бошлиги капитан Н. Узакбаев.`,
      setHeaderText: (headerText) => {
        set({
          headerText
        })
      }
    }),
    {
      name: 'material_akt_priyom'
    }
  )
)

interface AktPriyomPDFDialogProps extends Omit<DialogTriggerProps, 'children'> {
  docNum: string
  docDate: string
  organName: string
  receiverName: string
  note: string
  dovernost: string
  products: MaterialPrixodProvodka[]
}
export const AktPriyomPDFDialog: FC<AktPriyomPDFDialogProps> = ({
  docNum,
  docDate,
  dovernost,
  products,
  organName,
  receiverName,
  note,
  ...props
}) => {
  const { t } = useTranslation()
  const { headerText, setHeaderText } = useMaterialAktPriyomStore()

  const mainSchetQuery = useMainSchetQuery()
  const podpis = usePodpis(PodpisTypeDocument.JUR7_AKT_PRIYOM, true)

  const form = useForm({
    defaultValues: {
      headerText
    }
  })

  const headerTextValue = form.watch('headerText')
  useEffect(() => {
    setHeaderText(headerTextValue)
  }, [headerTextValue, setHeaderText])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-xl flex flex-col">
          <DialogHeader className="pb-5 border-b border-slate-200">
            <DialogTitle>{t('receive_akt')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className="-mx-5 px-5 flex-1 overflow-y-auto scrollbar"
            >
              <div className="py-4 space-y-2.5">
                <FormField
                  control={form.control}
                  name="headerText"
                  render={({ field }) => (
                    <Textarea
                      spellCheck={false}
                      rows={8}
                      className="scrollbar"
                      {...field}
                    />
                  )}
                />
              </div>
            </form>
          </Form>
          <div className="grid place-content-center border-t border-slate-200 pt-5">
            <GenerateFile
              fileName={`${t('receive_akt')}_${docNum}.pdf`}
              buttonText={t('receive_akt')}
            >
              <AktPriyomReport
                organName={organName}
                receiverName={receiverName}
                note={note}
                regionName={mainSchetQuery?.data?.data?.tashkilot_nomi ?? ''}
                docNum={docNum}
                docDate={docDate}
                podpis={podpis ?? []}
                dovernost={dovernost}
                products={products}
                headerText={form.watch('headerText')}
              />
            </GenerateFile>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
