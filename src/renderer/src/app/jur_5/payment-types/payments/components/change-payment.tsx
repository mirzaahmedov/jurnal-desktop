import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MainZarplataTable } from '@/app/jur_5/common/features/main-zarplata/main-zarplata-table'
import { GenericTable, LoadingOverlay, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { Form, FormField } from '@/common/components/ui/form'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, type VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'

import { PaymentColumnDefs } from '../columns'
import { PaymentsService } from '../service'

export const ChangePayment = () => {
  const form = useForm({
    defaultValues: {
      percentage: 0,
      summa: 0
    }
  })

  const { t } = useTranslation(['app'])
  const { treeNodes, vacantsQuery } = useVacantTreeNodes()

  const [activeVacant, setActiveVacant] = useState<VacantTreeNode | null>(null)
  const [selectedVacants, setSelectedVacants] = useState<VacantTreeNode[]>([])

  const { data: mainZarplata, isFetching: isFetchingMainZarplata } = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: activeVacant?.id ?? 0
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!activeVacant
  })
  const { data: payments, isFetching: isFetchingPayments } = useQuery({
    queryKey: [
      PaymentsService.QueryKeys.GetAll,
      {
        page: 1,
        limit: 100000
      }
    ],
    queryFn: PaymentsService.getAll
  })

  const handleSelectNode = (node: VacantTreeNode) => {
    setActiveVacant((prev) => (prev?.id === node.id ? null : node))
    setSelectedVacants((prev) => {
      if (prev.some((vacant) => vacant.id === node.id)) {
        return prev.filter((vacant) => vacant.id !== node.id)
      }
      return [...prev, node]
    })
  }

  const handleSubmit = form.handleSubmit((values) => {
    console.log({
      values
    })
  })

  return (
    <Allotment>
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={200}
        className="w-full divide-y flex flex-col bg-gray-50"
      >
        {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
        <VacantTree
          nodes={treeNodes}
          selectedIds={selectedVacants.map((vacant) => vacant.id)}
          onSelectNode={handleSelectNode}
        />
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="ml-px h-full flex flex-col">
          <div className="border-b p-5">
            <h5 className="text-xs font-bold text-gray-600">{activeVacant?.name}</h5>
          </div>
          {isFetchingMainZarplata ? <LoadingOverlay /> : null}
          <MainZarplataTable data={mainZarplata ?? []} />
          <div className="grid grid-cols-4 flex-1 overflow-hidden">
            <div className="border-r">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit}
                  className="p-5"
                >
                  <FormField
                    name="percentage"
                    control={form.control}
                    render={({ field }) => (
                      <FormElement
                        label={t('payment_percent')}
                        direction="column"
                      >
                        <NumericInput
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    name="summa"
                    control={form.control}
                    render={({ field }) => (
                      <FormElement
                        label={t('summa')}
                        direction="column"
                      >
                        <NumericInput
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                  <Button type="submit">{t('save')}</Button>
                </form>
              </Form>
            </div>
            <div className="col-span-3 h-full overflow-y-auto scrollbar">
              {isFetchingPayments ? <LoadingOverlay /> : null}
              <GenericTable
                columnDefs={PaymentColumnDefs}
                data={payments?.data ?? []}
                className="table-generic-xs"
              />
            </div>
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
