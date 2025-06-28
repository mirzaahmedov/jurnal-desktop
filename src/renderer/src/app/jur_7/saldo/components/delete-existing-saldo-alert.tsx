import type { OstatokDeleteExistingSaldo } from '../utils'
import type { DialogProps } from '@radix-ui/react-dialog'

import { Trans, useTranslation } from 'react-i18next'

import { Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'

export interface DeleteExistingSaldoAlertProps extends DialogProps {
  message: string
  data: OstatokDeleteExistingSaldo
}
export const DeleteExistingSaldoAlert = ({
  message,
  data,
  ...props
}: DeleteExistingSaldoAlertProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl">{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <DataList
          items={[
            {
              name: <Trans>month</Trans>,
              value: data.month
            },
            {
              name: <Trans>year</Trans>,
              value: data.year
            },
            {
              name: (
                <span>
                  <Trans>main-schet</Trans> <Trans>id</Trans>
                </span>
              ),
              value: (
                <Copyable
                  side="start"
                  value={data.main_schet_id}
                >
                  #{data.main_schet_id}
                </Copyable>
              )
            },
            {
              name: <Trans>main-schet</Trans>,
              value: (
                <Copyable
                  side="start"
                  value={data.account_number}
                >
                  {data.account_number}
                </Copyable>
              )
            }
          ]}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
