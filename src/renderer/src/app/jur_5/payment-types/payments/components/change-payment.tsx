import type { Payment } from '@/common/models/payments'

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
import { Form, FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PayrollPaymentService } from '@/common/features/payroll-payment/service'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, type VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import { useToggle } from '@/common/hooks'
import { getVacantRayon } from '@/common/utils/zarplata'

import { ChoosePaymentsDialog } from './choose-payments-dialog'

export const ChangePayment = () => {
  const paymentToggle = useToggle()

  const form = useForm({
    defaultValues: {
      percentage: 0,
      summa: 0,
      paymentId: 0
    }
  })

  const { t } = useTranslation(['app'])
  const { treeNodes, vacantsQuery } = useVacantTreeNodes()

  const [activeVacant, setActiveVacant] = useState<VacantTreeNode | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<Payment>()
  const [selectedVacants, setSelectedVacants] = useState<VacantTreeNode[]>([])

  const { mutate: changePayment, isPending } = useMutation({
    mutationFn: PayrollPaymentService.changePayment,
    onSuccess: () => {
      form.reset()
      setSelectedPayment(undefined)
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
    changePayment({
      isXarbiy: false,
      values: {
        paymentId: values.paymentId,
        payment: selectedPayment,
        vacants: selectedVacants.map((vacant) => ({ vacantId: vacant.id })),
        percentage: values.percentage,
        summa: values.summa
      }
    })
  })

  return (
    <Allotment>
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={200}
        className="w-full bg-gray-50"
      >
        <div className="h-full overflow-y-auto scrollbar">
          {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
          <VacantTree
            nodes={treeNodes}
            selectedIds={selectedVacants.map((vacant) => vacant.id)}
            onSelectNode={handleSelectNode}
          />
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="ml-px h-full flex flex-col">
          <div className="border-b p-5">
            <h5 className="text-xs font-bold text-gray-600">
              {activeVacant ? getVacantRayon(activeVacant) : null}
            </h5>
          </div>
          {isFetchingMainZarplata ? <LoadingOverlay /> : null}
          <div className="flex-1">
            <MainZarplataTable data={mainZarplata ?? []} />
          </div>
          <div className="border-r border-t bg-gray-100">
            <Form {...form}>
              <form
                onSubmit={handleSubmit}
                className="px-5 py-5"
              >
                <div className="mx-auto max-w-4xl flex flex-wrap gap-x-10 gap-y-5">
                  <div className="w-full">
                    <FormElement label={t('payment')}>
                      <Textarea
                        readOnly
                        rows={4}
                        value={[selectedPayment?.name, selectedPayment?.nameUz]
                          .filter(Boolean)
                          .join(' - ')}
                        onDoubleClick={paymentToggle.open}
                      />
                    </FormElement>
                  </div>
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
                    isDisabled={isPending || !activeVacant || !form.watch('paymentId')}
                    type="submit"
                  >
                    {t('save')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <ChoosePaymentsDialog
            isOpen={paymentToggle.isOpen}
            onOpenChange={paymentToggle.setOpen}
            selectedPaymentId={form.watch('paymentId')}
            onSelect={(payment) => {
              form.setValue('paymentId', payment.id)
              setSelectedPayment(payment)
              paymentToggle.close()
            }}
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
