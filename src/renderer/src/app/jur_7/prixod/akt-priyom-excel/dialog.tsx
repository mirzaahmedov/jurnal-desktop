import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { ApiEndpoints } from '@/common/features/crud'
import { DownloadFile } from '@/common/features/file'

import { useMaterialAktPriyomStore } from '../akt-priyom-pdf/dialog'

interface AktPriyomExcelDialogProps extends Omit<DialogTriggerProps, 'children'> {
  id: number
  docNum: string
  budjetId: number
  mainSchetId: number
}
export const AktPriyomExcelDialog: FC<AktPriyomExcelDialogProps> = ({
  id,
  docNum,
  budjetId,
  mainSchetId,
  ...props
}) => {
  const { t } = useTranslation(['app'])
  const { headerText, setHeaderText } = useMaterialAktPriyomStore()

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
            <DownloadFile
              url={`${ApiEndpoints.jur7_prixod}/${id}`}
              fileName={`${t('pages.material-warehouse')}_${t('prixod')}_${t('receive_akt')}_№${docNum}.xlsx`}
              buttonText={`${t('receive_akt')} (Excel)`}
              params={{
                budjet_id: budjetId,
                main_schet_id: mainSchetId,
                _comment: headerTextValue,
                akt: true
              }}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
