import type { Deduction } from '@/common/models/deduction'

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { MainZarplataTable } from '@/app/jur_5/common/features/main-zarplata/main-zarplata-table'
import { LoadingOverlay, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Label } from '@/common/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
import { Textarea } from '@/common/components/ui/textarea'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PayrollDeductionService } from '@/common/features/payroll-deduction/service'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { useToggle } from '@/common/hooks'
import { flattenTree } from '@/common/lib/tree/relation-tree'
import { getVacantRayon } from '@/common/utils/zarplata'

import { DeductionsChoosePaymentsDialog } from './choose-payments-dialog'

export const DeductionsChangePayment = () => {
  const deductionToggle = useToggle()

  const form = useForm({
    defaultValues: {
      type: 'all',
      percentage: 0,
      summa: 0,
      deductionId: 0
    }
  })

  const { t } = useTranslation(['app'])
  const { filteredTreeNodes, flatFilteredNodes, search, setSearch, vacantsQuery } =
    useVacantTreeNodes()

  const [activeVacant, setActiveVacant] = useState<VacantTreeNode | null>(null)
  const [selectedDeduction, setSelectedDeduction] = useState<Deduction>()
  const [selectedVacants, setSelectedVacants] = useState<VacantTreeNode[]>([])

  const { mutate: changePayment, isPending } = useMutation({
    mutationFn: PayrollDeductionService.changePayment,
    onSuccess: () => {
      form.reset()
      setSelectedDeduction(undefined)
      setSelectedVacants([])
      setActiveVacant(null)
      toast.success(t('update_success'))
    }
  })
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

  const handleSubmit = form.handleSubmit((values) => {
    changePayment({
      isXarbiy: values.type === 'military',
      values: {
        deductionId: values.deductionId,
        payment: selectedDeduction,
        vacants: selectedVacants.map((vacant) => ({ vacantId: vacant.id })),
        percentage: values.percentage,
        summa: values.summa
      }
    })
  })

  const selectedIds = selectedVacants.map((vacant) => vacant.id)
  const isAllSelected = flatFilteredNodes.every((vacant) =>
    selectedVacants.some((selected) => selected.id === vacant.id)
  )

  const isTreeBranchAllSelected = (node: VacantTreeNode, selected: VacantTreeNode[]): boolean => {
    if (!selected.find((s) => s.id === node.id)) {
      return false
    }
    return node.children.every((child) => isTreeBranchAllSelected(child, selected))
  }

  const handleSelectNode = (node: VacantTreeNode) => {
    setActiveVacant((prev) => (prev?.id === node.id ? null : node))
    setSelectedVacants((prev) => {
      if (isTreeBranchAllSelected(node, prev)) {
        const flatChildNodes = flattenTree(node.children)
        return prev.filter((p) => !flatChildNodes.some((c) => c.id === p.id) && p.id !== node.id)
      } else {
        const flatChildNodes = flattenTree(node.children)
        return prev
          .filter((p) => !flatChildNodes.some((c) => c.id === p.id) && p.id !== node.id)
          .concat(flatChildNodes, [node])
      }
    })
  }
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedVacants([])
    } else {
      setSelectedVacants(flatFilteredNodes)
    }
  }

  return (
    <Allotment>
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={200}
        className="w-full bg-gray-50"
      >
        <div className="h-full flex flex-col">
          <VacantTreeSearch
            search={search}
            onValueChange={setSearch}
            treeNodes={filteredTreeNodes}
          />
          <div className="px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                isSelected={isAllSelected}
                isIndeterminate={!isAllSelected && selectedVacants.length > 0}
                onChange={handleSelectAll}
              />
              <Label
                htmlFor="select-all"
                className="text-xs font-semibold"
              >
                {t('select_all')}
              </Label>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar">
            {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
            <VacantTree
              nodes={filteredTreeNodes}
              selectedIds={selectedIds}
              onSelectNode={handleSelectNode}
            />
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="ml-px h-full overflow-hidden flex flex-col">
          <div className="border-b p-5">
            <h5 className="text-xs font-bold text-gray-600">
              {activeVacant ? getVacantRayon(activeVacant) : null}
            </h5>
          </div>
          {isFetchingMainZarplata ? <LoadingOverlay /> : null}
          <div className="flex-1 overflow-auto scrollbar">
            <MainZarplataTable data={mainZarplata ?? []} />
          </div>
          <div className="border-r border-t bg-gray-100">
            <Form {...form}>
              <form
                onSubmit={handleSubmit}
                className="px-5 py-5"
              >
                <div className="flex flex-wrap gap-x-10 gap-y-2.5">
                  <div className="w-full">
                    <FormElement label={t('payment')}>
                      <Textarea
                        readOnly
                        rows={2}
                        value={[selectedDeduction?.name].filter(Boolean).join(' - ')}
                        onDoubleClick={deductionToggle.open}
                      />
                    </FormElement>
                  </div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex items-center gap-5"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="all"
                            id="all"
                          />
                          <Label htmlFor="all">{t('all')}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="military"
                            id="military"
                          />
                          <Label htmlFor="military">{t('military')}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="civilian"
                            id="civilian"
                          />
                          <Label htmlFor="civilian">{t('civilian')}</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  <FormField
                    name="percentage"
                    control={form.control}
                    render={({ field }) => (
                      <FormElement label={`${t('payment_percent')} (%)`}>
                        <NumericInput
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          allowNegative={false}
                          isAllowed={(values) => (values.floatValue ?? 0) <= 100}
                          onValueChange={(values) => {
                            if (values.floatValue) {
                              form.setValue('summa', 0)
                            }
                            field.onChange(values.floatValue ?? 0)
                          }}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    name="summa"
                    control={form.control}
                    render={({ field }) => (
                      <FormElement label={t('summa')}>
                        <NumericInput
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onValueChange={(values) => {
                            if (values.floatValue) {
                              form.setValue('percentage', 0)
                            }
                            field.onChange(values.floatValue ?? 0)
                          }}
                        />
                      </FormElement>
                    )}
                  />
                  <Button
                    isPending={isPending}
                    isDisabled={isPending || !selectedVacants.length || !form.watch('deductionId')}
                    type="submit"
                  >
                    {t('save')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <DeductionsChoosePaymentsDialog
            isOpen={deductionToggle.isOpen}
            onOpenChange={deductionToggle.setOpen}
            selectedDeductionId={form.watch('deductionId')}
            onSelect={(deduction) => {
              form.setValue('deductionId', deduction.id)
              setSelectedDeduction(deduction)
              deductionToggle.close()
            }}
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
