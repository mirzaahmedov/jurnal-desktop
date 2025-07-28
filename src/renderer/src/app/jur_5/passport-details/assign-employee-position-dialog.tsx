import type { MainZarplata } from '@/common/models'
import type { Workplace } from '@/common/models/workplace'
import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { WorkplaceColumns } from '@/common/features/workplace/columns'
import { WorkplaceService } from '@/common/features/workplace/service'
import { usePagination } from '@/common/hooks'
import { formatLocaleDate } from '@/common/lib/format'

import {
  AssignPositionFormSchema,
  type AssignPositionFormValues,
  defaultAssignPositionValues
} from './config'

export interface AssignEmployeePositionDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplata?: MainZarplata
  onSubmit?: (values: AssignPositionFormValues) => void
}
export const AssignEmployeePositionDialog = ({
  mainZarplata,
  onSubmit,
  ...props
}: AssignEmployeePositionDialogProps) => {
  const { t } = useTranslation(['app'])

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)
  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null)

  const pagination = usePagination()
  const form = useForm({
    defaultValues: defaultAssignPositionValues,
    resolver: zodResolver(AssignPositionFormSchema)
  })

  const { filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()

  const { data: workplaces, isFetching: isFetchingWorkplaces } = useQuery({
    queryKey: [
      WorkplaceService.QueryKeys.GetAll,
      {
        vacantId: selectedVacant?.id ?? 0,
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: WorkplaceService.getWorkplaces,
    placeholderData: undefined,
    enabled: !!selectedVacant
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (!selectedWorkplace) return

    onSubmit?.({
      doljnostPrikazNum: values.doljnostPrikazNum,
      doljnostPrikazDate: formatLocaleDate(values.doljnostPrikazDate),
      workplaceId: selectedWorkplace.id
    })
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-full h-full max-h-[1000px] p-0">
          <div className="h-full flex flex-col divide-y">
            <DialogHeader className="p-5">
              <DialogTitle>{t('assign_to_position')}</DialogTitle>
            </DialogHeader>

            <Allotment className="h-full divide-x">
              <Allotment.Pane
                preferredSize={300}
                maxSize={600}
                minSize={300}
                className="w-full divide-y bg-gray-50"
              >
                <div className="relative h-full flex flex-col">
                  {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
                  <VacantTreeSearch
                    search={search}
                    onValueChange={setSearch}
                    treeNodes={filteredTreeNodes}
                  />
                  <div className="flex-1 overflow-auto scrollbar">
                    <VacantTree
                      nodes={filteredTreeNodes}
                      selectedIds={selectedVacant ? [selectedVacant.id] : []}
                      onSelectNode={(vacant) => {
                        setSelectedVacant(vacant)
                      }}
                    />
                  </div>
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <div className="h-full flex flex-col">
                  <div className="relative flex-1 w-full overflow-auto scrollbar">
                    {isFetchingWorkplaces ? <LoadingOverlay /> : null}
                    <GenericTable
                      data={workplaces?.data ?? []}
                      columnDefs={WorkplaceColumns}
                      selectedIds={selectedWorkplace ? [selectedWorkplace.id] : []}
                      className="table-generic-xs"
                      getRowClassName={(row) =>
                        !row.mainZarplataId
                          ? 'bg-emerald-100 hover:bg-emerald-100 even:bg-emerald-100 even:hover:bg-emerald-100 [&>*]:text-emerald-700 [&>td]:border-r-emerald-200 [&>td]:border-b-emerald-200'
                          : 'pointer-events-none'
                      }
                      onClickRow={(workplace) => setSelectedWorkplace(workplace)}
                    />
                  </div>
                  <div className="p-5">
                    <Pagination
                      {...pagination}
                      count={workplaces?.meta?.count ?? 0}
                      pageCount={workplaces?.meta?.pageCount ?? 0}
                    />
                  </div>
                  <div className="border-t p-5 bg-gray-100">
                    <Form {...form}>
                      <form className="grid grid-cols-2 items-start gap-5 mx-auto w-full max-w-6xl">
                        <div className="space-y-2 w-full">
                          <Textarea
                            readOnly
                            value={mainZarplata?.rayon ?? ''}
                            className="bg-white w-full"
                            rows={3}
                          />
                          <FormElement
                            controlled={false}
                            label={t('doljnost')}
                            grid="1:3"
                          >
                            <Input
                              value={selectedWorkplace?.spravochnikZarpaltaDoljnostName ?? ''}
                              readOnly
                              className="w-full"
                            />
                          </FormElement>
                        </div>

                        <div className="flex flex-col justify-between w-full">
                          <FormElement
                            controlled={false}
                            label={t('employee')}
                            grid="1:4"
                          >
                            <Input
                              value={mainZarplata?.fio ?? ''}
                              readOnly
                            />
                          </FormElement>

                          <FormElement
                            controlled={false}
                            grid="1:4"
                            label={t('order')}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <FormField
                                control={form.control}
                                name="doljnostPrikazNum"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    error={!!form.formState.errors.doljnostPrikazNum?.message}
                                  />
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="doljnostPrikazDate"
                                render={({ field }) => (
                                  <JollyDatePicker
                                    {...field}
                                    containerProps={{ className: 'min-w-0' }}
                                    error={!!form.formState.errors.doljnostPrikazDate?.message}
                                  />
                                )}
                              />
                            </div>
                          </FormElement>

                          <div className="text-end">
                            <Button
                              type="button"
                              onClick={handleSubmit}
                            >
                              <CheckCircle className="btn-icon icon-start" />
                              {t('assign_to_position')}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </Allotment.Pane>
            </Allotment>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
