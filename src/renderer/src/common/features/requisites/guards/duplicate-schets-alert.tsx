import { type ReactNode, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'
import {
  type DuplicateSchet,
  RequisitesQueryKeys,
  checkSchetsDuplicateQuery,
  useRequisitesStore
} from '@/common/features/requisites'
import { useToggle } from '@/common/hooks'

export const DuplicateSchetsAlert = () => {
  const alertToggle = useToggle()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { t } = useTranslation()

  const { data: duplicates, isFetching } = useQuery({
    queryKey: [
      RequisitesQueryKeys.duplicates,
      {
        budjet_id: budjet_id!
      }
    ],
    queryFn: checkSchetsDuplicateQuery,
    placeholderData: () => undefined,
    gcTime: 0,
    refetchOnMount: true,
    staleTime: 0
  })

  useEffect(() => {
    if (duplicates?.data?.length && !isFetching) {
      alertToggle.open()
    }
  }, [isFetching, duplicates])

  return (
    <AlertDialog
      open={alertToggle.isOpen}
      onOpenChange={alertToggle.setOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold">{t('duplicate_schets')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col gap-10">
          {duplicates ? (
            <div>
              <DataList
                items={
                  duplicates?.data?.map((schet) => {
                    const { name, value } = getSchetValues(schet)
                    return {
                      name,
                      value
                    }
                  }) ?? []
                }
              />
            </div>
          ) : null}
        </div>

        <AlertDialogFooter className="items-end">
          <AlertDialogCancel>{t('close')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const getSchetValues = (schet: DuplicateSchet): { name: string; value: ReactNode } => {
  for (const key of Object.keys(schet)) {
    if (key !== 'count') {
      const nth = key.match(/(\d+)/)
      return {
        name: nth && nth.length ? t('mo-nth', { nth: nth[0] }) : key,
        value: (
          <div className="inline-flex gap-1">
            <span>{schet[key]}</span>
            <span className="font-normal">x</span>
            <span className="font-normal">{schet.count}</span>
          </div>
        )
      }
    }
  }
  return { name: '', value: '' }
}
