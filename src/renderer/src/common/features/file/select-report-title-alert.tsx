import type { DialogProps } from '@radix-ui/react-dialog'

import tutorialImage from '@resources/report-title-tutorial.jpg'
import { useTranslation } from 'react-i18next'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'

export const SelectReportTitleAlert = (props: DialogProps) => {
  const { t } = useTranslation()
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="w-full max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('please_select_report_title')}</AlertDialogTitle>
        </AlertDialogHeader>
        <img
          src={tutorialImage}
          alt={t('please_select_report_title')}
          className="rounded-xl"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>{t('close')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
