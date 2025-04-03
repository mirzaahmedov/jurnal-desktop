import type { DialogProps } from '@radix-ui/react-dialog'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter
} from '@renderer/common/components/ui/alert-dialog'
import tutorialImage from '@resources/report-title-tutorial.jpg'
import { useTranslation } from 'react-i18next'

export const SelectReportTitleAlert = (props: DialogProps) => {
  const { t } = useTranslation()
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="w-full max-w-4xl">
        <img
          src={tutorialImage}
          alt="Tutorial"
          className="rounded-xl"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>{t('close')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
