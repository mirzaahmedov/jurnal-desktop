import type { SoliqOrganization } from './model'
import type { FC } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'

import { CheckSquare, CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

export const SoliqOrganizationModal: FC<
  {
    organization: SoliqOrganization | undefined
    onConfirm: VoidFunction
  } & Omit<DialogTriggerProps, 'children'>
> = ({ organization, onConfirm, ...props }) => {
  const { t } = useTranslation(['integration'])
  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <CircleAlert className="text-green-500 size-40 mx-auto" />
            <DialogTitle className="mt-5 mx-auto max-w-sm text-center text-2xl">
              {t('organization_found_on_tax_database')}
            </DialogTitle>
          </DialogHeader>
          {organization ? (
            <DataList
              className="mt-10"
              items={[
                {
                  name: t('name'),
                  value: organization.name
                },
                {
                  name: t('inn'),
                  value: organization.inn
                },
                {
                  name: t('okonx'),
                  value: organization.okonx
                },
                {
                  name: t('mfo'),
                  value: organization.mfo
                },
                {
                  name: t('raschet-schet'),
                  value: organization.account_number
                }
              ]}
            />
          ) : null}
          <DialogFooter className="mt-10">
            <Button onClick={onConfirm}>
              <CheckSquare className="btn-icon icon-start" /> {t('autofill')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                props?.onOpenChange?.(false)
              }}
            >
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
