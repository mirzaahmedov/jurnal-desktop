import type { ShartnomaGrafikForm } from '../../service'

import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { FormElement } from '@/common/components/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { Input } from '@/common/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
import { Textarea } from '@/common/components/ui/textarea'
import { useEffect, useMemo } from 'react'
import { DatePicker, NumericInput } from '@/common/components'
import { GenerateDocumentButton } from '@/common/components'
import { ContractScheduleTemplate } from '../report'
import { defaultValues, ReportDialogPayloadSchema } from './constants'
import { formatDate } from '@/common/lib/date'
import { monthNames } from '@/common/data/month'
import { buildContractDetailsText } from './utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'

type GenerateReportDialogProps = {
  schedule: ShartnomaGrafikForm
  open: boolean
  onChange: (open: boolean) => void
}
const GenerateReportDialog = ({ schedule, open, onChange }: GenerateReportDialogProps) => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(ReportDialogPayloadSchema),
    reValidateMode: 'onChange'
  })

  const summaTotal = useMemo(() => {
    return roundNumberToTwoDecimalPlaces(
      monthNames.reduce((acc, { name }) => acc + schedule[name], 0)
    )
  }, [schedule])

  const percentageValue = form.watch('percentage')
  const payment_date = form.watch('payment_date')
  const summaValue = form.watch('summa_value')
  useEffect(() => {
    form.setValue(
      'payment_details',
      buildContractDetailsText({
        percentageValue,
        payment_date,
        summaValue,
        summaTotal
      })
    )
  }, [form, percentageValue, payment_date, summaValue, summaTotal])

  useEffect(() => {
    form.setValue(
      'contract_details',
      `ЕМУ УБДД ГУВД г. Ташкент ва "ТСҲТТ" АК "Ўзбектелеком" билан умумий суммадаги 12000000 12 Миллион сум 0 тийин. 05.02.2024 йилдаги ТРГ/Б2Г-296221 53-сонли шартномага`
    )
  }, [form])

  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>График оплаты</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="mt-4">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormElement direction="column" label="Бўлим">
                      <Input type="number" {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subchapter"
                  render={({ field }) => (
                    <FormElement direction="column" label="Кичик бўлим">
                      <Input type="number" {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chapter"
                  render={({ field }) => (
                    <FormElement direction="column" label="Боб">
                      <Input type="number" {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_date"
                  render={({ field }) => (
                    <FormElement label="Дата оплаты" direction="column">
                      <DatePicker {...field} />
                    </FormElement>
                  )}
                />
              </div>

              {percentageValue === 'custom' ? (
                <FormField
                  control={form.control}
                  name="summa_value"
                  render={({ field }) => (
                    <FormElement label="Сумма">
                      <NumericInput
                        {...field}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value.floatValue)}
                      />
                    </FormElement>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Процент оплаты</FormLabel>
                    <FormControl>
                      <RadioGroup {...field} value={field.value} onValueChange={field.onChange}>
                        {['30', '70', '100'].map((value) => (
                          <FormItem key={value} className="flex flex-row items-center space-x-4">
                            <FormControl>
                              <RadioGroupItem value={value} />
                            </FormControl>
                            <FormLabel className="!my-0 cursor-pointer">{value}%</FormLabel>
                          </FormItem>
                        ))}
                        <FormItem key="custom" className="flex flex-row items-center space-x-4">
                          <FormControl>
                            <RadioGroupItem value="custom" />
                          </FormControl>
                          <FormLabel className="!my-0 cursor-pointer">Другой</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 space-y-2">
              <FormField
                control={form.control}
                name="payment_details"
                render={({ field }) => <Textarea spellCheck={false} rows={5} {...field} />}
              />
              <FormField
                control={form.control}
                name="contract_details"
                render={({ field }) => <Textarea spellCheck={false} rows={5} {...field} />}
              />
            </div>
          </form>
        </Form>
        <GenerateDocumentButton
          disabled={
            form.watch('section') === 0 ||
            form.watch('subchapter') === 0 ||
            form.watch('chapter') === 0
          }
          fileName={`график_договора.pdf`}
          buttonText="График договора"
        >
          <ContractScheduleTemplate
            article={''}
            section={form.watch('section').toString()}
            subchapter={form.watch('subchapter').toString()}
            chapter={form.watch('chapter').toString()}
            createdDate={formatDate(new Date())}
            schedule={schedule}
            paymentDetails={form.watch('payment_details')}
            contractDetails={form.watch('contract_details')}
          />
        </GenerateDocumentButton>
      </DialogContent>
    </Dialog>
  )
}

export { GenerateReportDialog }
