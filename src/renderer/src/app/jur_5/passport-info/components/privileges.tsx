import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { Checkbox } from '@/common/components/jolly/checkbox'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { PrivilegesForm } from '@/common/features/zarplata/privilege/privileges-form'
import { PrivilegeService } from '@/common/features/zarplata/privilege/service'
import { useToggle } from '@/common/hooks'

export interface PrivilegesProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplataId: number
}
export const Privileges: FC<PrivilegesProps> = ({ mainZarplataId, ...props }) => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const [selectedPrivilege, setSelectedPrivilege] = useState<any | undefined>(undefined)

  const { t } = useTranslation()
  const { data: privileges, isFetching } = useQuery({
    queryKey: [PrivilegeService.QueryKeys.GetAll, mainZarplataId],
    queryFn: PrivilegeService.getAll,
    enabled: !!props.isOpen
  })

  const createPrivilege = useMutation({
    mutationFn: PrivilegeService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      dialogToggle.close()
      queryClient.invalidateQueries({
        queryKey: [PrivilegeService.QueryKeys.GetAll, mainZarplataId]
      })
      setSelectedPrivilege(undefined)
    }
  })
  const updatePrivilege = useMutation({
    mutationFn: PrivilegeService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      dialogToggle.close()
      queryClient.invalidateQueries({
        queryKey: [PrivilegeService.QueryKeys.GetAll, mainZarplataId]
      })
      setSelectedPrivilege(undefined)
    }
  })
  const deletePrivilege = useMutation({
    mutationFn: PrivilegeService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      dialogToggle.close()
      queryClient.invalidateQueries({
        queryKey: [PrivilegeService.QueryKeys.GetAll, mainZarplataId]
      })
      setSelectedPrivilege(undefined)
    }
  })

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="w-full max-w-6xl h-full max-h-[800px]">
            <div className="flex flex-col h-full gap-5">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>{t('privileges')}</DialogTitle>
                <Button
                  IconStart={PlusIcon}
                  onPress={dialogToggle.open}
                >
                  {t('create')}
                </Button>
              </DialogHeader>
              <div className="flex-1 relative overflow-y-auto scrollbar">
                {isFetching ? <LoadingOverlay /> : null}
                <GenericTable
                  data={privileges ?? []}
                  columnDefs={[
                    {
                      header: t('name'),
                      key: 'name'
                    },
                    {
                      header: t('opisanie'),
                      key: 'description'
                    },
                    {
                      numeric: true,
                      header: t('summa'),
                      key: 'summa',
                      renderCell: SummaCell
                    },
                    {
                      header: t('has_gotten_payroll'),
                      key: 'isRaschet',
                      width: 200,
                      renderCell: (row) => (
                        <Checkbox
                          isReadOnly
                          isSelected={row.isRaschet}
                        />
                      )
                    }
                  ]}
                  onDelete={(row) => {
                    deletePrivilege.mutate(row.id)
                  }}
                  onEdit={(row) => {
                    setSelectedPrivilege(row)
                    dialogToggle.open()
                  }}
                  className="table-generic-xs"
                />
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <PrivilegesForm
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selectedPrivilege}
        onSubmit={(values) => {
          if (selectedPrivilege) {
            updatePrivilege.mutate({
              id: selectedPrivilege.id,
              values: {
                mainZarplataId,
                name: values.name,
                summa: values.summa,
                isRaschet: values.isRaschet,
                description: values.description
              }
            })
          } else {
            createPrivilege.mutate({
              mainZarplataId,
              name: values.name,
              summa: values.summa,
              isRaschet: values.isRaschet,
              description: values.description
            })
          }
        }}
      />
    </>
  )
}
