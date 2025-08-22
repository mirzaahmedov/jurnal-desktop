import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useState } from 'react'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { DownloadFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatDate } from '@/common/lib/date'

export interface ShartnomaBySmetaDialogProps extends Omit<DialogTriggerProps, 'children'> {}
export const ShartnomaBySmetaDialog: FC<ShartnomaBySmetaDialogProps> = () => {
  const { t } = useTranslation(['app'])

  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))

  return (
    <DialogTrigger>
      <Button
        variant="ghost"
        IconStart={Download}
      >
        {t('report')}
      </Button>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('report')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 items-start justify-start">
            <JollyDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
            />
            <DownloadFile
              url="/shartnoma/by-smeta"
              fileName={t('report') + '.xlsx'}
              params={{
                to: selectedDate,
                main_schet_id: mainSchetId,
                excel: true
              }}
              buttonText={t('download')}
              className="ml-auto"
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
