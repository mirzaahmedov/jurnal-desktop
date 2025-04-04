import type { ShartnomaGrafikFormValues } from '@/app/organization/shartnoma/service'

import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { Settings2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DatePicker, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
import { Textarea } from '@/common/components/ui/textarea'
import { GenerateFile } from '@/common/features/file'
import { usePodpis } from '@/common/features/podpis'
import { formatDate } from '@/common/lib/date'
import { calculateAnnualTotalSum, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'
import {
  type MainSchet,
  type Organization,
  PodpisDoljnost,
  PodpisTypeDocument
} from '@/common/models'
import { DocumentOrientation, DocumentPaddingFields } from '@/common/widget/form'

import { ShartnomaGrafikPDFDocument } from '../ShartnomaGrafik'
import { ReportDialogFormSchema, defaultValues } from './constants'
import { buildContractDetailsText, buildContractPaymentDetailsText } from './utils'

export interface ShartnomaSmetaGrafikGeneratePDFDocumentDialogProps {
  grafiks: ShartnomaGrafikFormValues[]
  doc_date: string
  doc_num: string
  open: boolean
  main_schet: MainSchet
  organization: Organization
  onChange: (open: boolean) => void
}
export const ShartnomaSmetaGrafikGeneratePDFDocumentDialog = ({
  grafiks,
  doc_date,
  doc_num,
  main_schet,
  organization,
  open,
  onChange
}: ShartnomaSmetaGrafikGeneratePDFDocumentDialogProps) => {
  const { t } = useTranslation(['podpis'])

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      singlePage: grafiks.length <= 3
    },
    resolver: zodResolver(ReportDialogFormSchema),
    reValidateMode: 'onChange'
  })

  const podpis = usePodpis(PodpisTypeDocument.SHARTNOMA_GRAFIK_OPLATI, true)

  const summaTotal = useMemo(() => {
    return roundNumberToTwoDecimalPlaces(
      grafiks.reduce((result, grafik) => result + calculateAnnualTotalSum(grafik), 0)
    )
  }, [grafiks])

  const percentageValue = form.watch('percentage')
  const paymentDate = form.watch('payment_date')
  const summaValue = form.watch('summa_value')
  useEffect(() => {
    form.setValue(
      'payment_details',
      buildContractPaymentDetailsText({
        percentageValue,
        paymentDate,
        summaValue,
        summaTotal
      })
    )
  }, [form, percentageValue, paymentDate, summaValue, summaTotal])

  useEffect(() => {
    form.setValue(
      'contract_details',
      buildContractDetailsText({
        main_schet,
        organization,
        doc_date,
        doc_num,
        summa: summaTotal
      })
    )
  }, [form, main_schet, organization, doc_date, doc_num, summaTotal])

  useEffect(() => {
    const rukovoditel = podpis.find((item) => item.doljnost_name === PodpisDoljnost.RUKOVODITEL)
    const glav_mib = podpis.find((item) => item.doljnost_name === PodpisDoljnost.GLAV_MIB)

    if (rukovoditel && !form.getValues('rukovoditel')) {
      form.setValue('rukovoditel', rukovoditel.fio_name)
    }
    if (glav_mib && !form.getValues('glav_mib')) {
      form.setValue('glav_mib', glav_mib.fio_name)
    }
  }, [form, podpis])

  useEffect(() => {
    form.setValue('singlePage', grafiks.length <= 3)
  }, [form, grafiks])

  return (
    <Dialog
      open={open}
      onOpenChange={onChange}
    >
      <DialogContent className="max-h-full flex flex-col">
        <DialogHeader className="pb-5 border-b border-slate-200">
          <DialogTitle>{t('payment-schedule')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            className="-mx-5 px-5 flex-1 overflow-y-auto scrollbar"
          >
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label="Бўлим"
                    >
                      <Input
                        type="number"
                        {...field}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subchapter"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label="Кичик бўлим"
                    >
                      <Input
                        type="number"
                        {...field}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chapter"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label="Боб"
                    >
                      <Input
                        type="number"
                        {...field}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_date"
                  render={({ field }) => (
                    <FormElement
                      label="Дата оплаты"
                      direction="column"
                    >
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
                        allowNegative={false}
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
                      <RadioGroup
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {['30', '70', '100'].map((value) => (
                          <FormItem
                            key={value}
                            className="flex flex-row items-center space-x-4"
                          >
                            <FormControl>
                              <RadioGroupItem value={value} />
                            </FormControl>
                            <FormLabel className="!my-0 cursor-pointer">{value}%</FormLabel>
                          </FormItem>
                        ))}
                        <FormItem
                          key="custom"
                          className="flex flex-row items-center space-x-4"
                        >
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
                render={({ field }) => (
                  <Textarea
                    spellCheck={false}
                    rows={5}
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="contract_details"
                render={({ field }) => (
                  <Textarea
                    spellCheck={false}
                    rows={5}
                    {...field}
                  />
                )}
              />
              <div className="pt-2.5 grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="rukovoditel"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={t('podpis:doljnost.rukovoditel')}
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="glav_mib"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={t('podpis:doljnost.glav_mib')}
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="singlePage"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          ref={field.ref}
                          onBlur={field.onBlur}
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(!!checked)}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">{t('print-2-in-single-page')}</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost">
                        <Settings2 className="btn-icon icon-start" /> {t('additional-options')}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="bg-slate-50 p-5 flex flex-col gap-5">
                        <DocumentPaddingFields
                          form={form}
                          landscape={form.watch('orientation') === DocumentOrientation.LANDSCAPE}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
          </form>
        </Form>
        <div className="grid place-content-center border-t border-slate-200 pt-5">
          <GenerateFile
            disabled={
              form.watch('section') === 0 ||
              form.watch('subchapter') === 0 ||
              form.watch('chapter') === 0
            }
            fileName={`график_договора.pdf`}
            buttonText="График договора"
          >
            <ShartnomaGrafikPDFDocument
              singlePage={form.watch('singlePage')}
              section={form.watch('section').toString()}
              subchapter={form.watch('subchapter').toString()}
              chapter={form.watch('chapter').toString()}
              createdDate={formatDate(new Date())}
              grafiks={grafiks.map((grafik) => ({
                ...grafik,
                smeta_number: '4110000',
                itogo: calculateAnnualTotalSum(grafik)
              }))}
              paymentDetails={form.watch('payment_details')}
              shartnomaDetails={form.watch('contract_details')}
              rukovoditel={form.watch('rukovoditel')}
              glav_mib={form.watch('glav_mib')}
              paddingLeft={form.watch('paddingLeft')}
              paddingTop={form.watch('paddingTop')}
              paddingRight={form.watch('paddingRight')}
              paddingBottom={form.watch('paddingBottom')}
              orientation={form.watch('orientation')}
            />
          </GenerateFile>
        </div>
      </DialogContent>
    </Dialog>
  )
}
