import type { FC } from 'react'
import type { DialogTriggerProps } from 'react-aria-components'

import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { UserCell } from '@/common/components/table/renderers/user'

export interface AdminDocument {
  id: number
  type: string
  organization_name: null
  doc_num: string
  doc_date: string
  prixod_sum: number
  rasxod_sum: number
  id_podotchet_litso: number
  spravochnik_podotchet_litso_name: string
  opisanie: string
  combined_doc_date: string
  combined_id: number
  combined_doc_num: string
  login: string
  fio: string
  user_id: number
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
}

interface ViewDocumentsModalProps extends Omit<DialogTriggerProps, 'children'> {
  docs: AdminDocument[]
}
export const ViewDocumentsModal: FC<ViewDocumentsModalProps> = ({ docs }) => {
  const { t } = useTranslation()
  return (
    <DialogTrigger>
      <DialogOverlay>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>{t('documents')}</DialogTitle>
          </DialogHeader>
          <div>
            <GenericTable
              data={docs}
              columnDefs={[
                {
                  key: 'doc_num'
                },
                {
                  key: 'doc_date'
                },
                {
                  key: 'spravochnik_podotchet_litso_name',
                  header: 'podotchet-litso'
                },
                {
                  key: 'organization_name',
                  header: 'organization'
                },
                {
                  key: 'prixod_sum',
                  header: 'prixod'
                },
                {
                  key: 'rasxod_sum',
                  header: 'rasxod'
                },
                {
                  fit: true,
                  key: 'user_id',
                  minWidth: 200,
                  header: 'created-by-user',
                  renderCell: (row) => (
                    <UserCell
                      id={row.user_id}
                      fio={row.fio}
                      login={row.login}
                    />
                  )
                }
              ]}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
