import { DatePicker, Fieldset, NumericInput } from '@/common/components'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { ShartnomaGrafikFormSchema, shartnomaGrafikDetailsService } from '../service'
import { defaultValues, shartnomaGrafikQueryKeys } from '../constants'
import { mainSchetQueryKeys, mainSchetService } from '@renderer/app/region-spravochnik/main-schet'
import { numberToWords, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'
import {
  organizationQueryKeys,
  organizationService
} from '@renderer/app/region-spravochnik/organization'
import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/common/components/ui/button'
import { DetailsView } from '@/common/views'
import { DownloadIcon } from 'lucide-react'
import { FormElement } from '@/common/components/form'
import { GenerateReportDialog } from '../templates/report-dialog/dialog'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { formatNumber } from '@/common/lib/format'
import { monthNames } from '@/common/data/month'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useLayout } from '@/common/features/layout'
import { useOrgId } from '../hooks'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useToggle } from '@/common/hooks/use-toggle'
import { zodResolver } from '@hookform/resolvers/zod'

const ShartnomaGrafikDetailsPage = () => {
  const [orgId] = useOrgId()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const reportToggle = useToggle()

  const form = useForm({
    resolver: zodResolver(ShartnomaGrafikFormSchema),
    defaultValues
  })

  const { data: main_schet } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById
  })
  const { data: organization } = useQuery({
    queryKey: [organizationQueryKeys.getById, Number(orgId)],
    queryFn: organizationService.getById
  })
  const { data: shartnomaGrafik, isFetching } = useQuery({
    queryKey: [
      shartnomaGrafikQueryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: shartnomaGrafikDetailsService.getById,
    enabled: id !== 'create' && !!main_schet_id
  })

  const { mutate: update } = useMutation({
    mutationKey: [shartnomaGrafikQueryKeys.update],
    mutationFn: shartnomaGrafikDetailsService.update,
    onSuccess() {
      toast.success('Документ успешно обновлен')

      queryClient.invalidateQueries({
        queryKey: [shartnomaGrafikQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaGrafikQueryKeys.getById, id]
      })

      navigate(`/organization/shartnoma-grafik?org_id=${orgId}`)
    },
    onError(error) {
      toast.error('Произошла ошибка при обновлении документа: ' + error.message)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    update({
      id: shartnomaGrafik?.data?.id,
      ...payload
    })
  })

  useEffect(() => {
    if (!shartnomaGrafik?.data) {
      form.reset(defaultValues)
      return
    }
    const data = shartnomaGrafik.data
    form.reset({
      oy_1: data.oy_1 ?? 0,
      oy_2: data.oy_2 ?? 0,
      oy_3: data.oy_3 ?? 0,
      oy_4: data.oy_4 ?? 0,
      oy_5: data.oy_5 ?? 0,
      oy_6: data.oy_6 ?? 0,
      oy_7: data.oy_7 ?? 0,
      oy_8: data.oy_8 ?? 0,
      oy_9: data.oy_9 ?? 0,
      oy_10: data.oy_10 ?? 0,
      oy_11: data.oy_11 ?? 0,
      oy_12: data.oy_12 ?? 0
    })
  }, [form, shartnomaGrafik, id])

  const payload = form.watch()
  const summa = useMemo(() => {
    return roundNumberToTwoDecimalPlaces(
      Object.values(payload).reduce((acc, curr) => acc + curr, 0)
    )
  }, [payload])

  useLayout({
    title: 'Обновить график договора',
    onBack() {
      navigate(`/organization/shartnoma-grafik?org_id=${orgId}`)
    }
  })

  useEffect(() => {
    if (!orgId) {
      toast.error('Выберите организацию')
      navigate(`/organization/shartnoma-grafik`)
    }
  }, [orgId])

  console.log('rendering shartnoma-grafik details')

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <Fieldset
                name="Платежные документы"
                className="pr-0"
              >
                <div className="flex items-center gap-5 flex-wrap">
                  <FormElement label="Документ №">
                    <Input
                      readOnly
                      value={shartnomaGrafik?.data.doc_num}
                    />
                  </FormElement>
                  <FormElement label="Дата проводки">
                    <DatePicker
                      readOnly
                      value={shartnomaGrafik?.data.doc_date ?? ''}
                    />
                  </FormElement>
                </div>
              </Fieldset>
              <Fieldset name="Приход">
                <div className="flex items-start gap-5">
                  <div className="flex flex-col gap-5">
                    <FormElement label="Сумма">
                      <Input
                        readOnly
                        value={formatNumber(shartnomaGrafik?.data.summa ?? 0)}
                        className="text-right"
                      />
                    </FormElement>
                  </div>

                  <Textarea
                    readOnly
                    className="flex-1 max-w-2xl"
                    rows={4}
                    value={numberToWords(shartnomaGrafik?.data.summa ?? 0)}
                  />
                </div>
              </Fieldset>
              <div className="grid grid-cols-4 p-5 gap-y-5 gap-x-10">
                {monthNames.map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem key={name}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <NumericInput
                            {...field}
                            allowNegative={false}
                            value={field.value || ''}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0)
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <DetailsView.Footer>
              <div className="flex items-center gap-10">
                <DetailsView.Create disabled={summa !== shartnomaGrafik?.data.summa} />
                {(shartnomaGrafik?.data.summa ?? 0) - summa ? (
                  <p className="flex items-center gap-5">
                    <b className="text-sm text-slate-500">Остаток:</b>
                    <span className="font-bold text-destructive">
                      {formatNumber((shartnomaGrafik?.data.summa ?? 0) - summa)}
                    </span>
                  </p>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={reportToggle.open}
                  disabled={!main_schet?.data || !organization?.data || !shartnomaGrafik?.data}
                >
                  <DownloadIcon className="btn-icon icon-start" />
                  График оплаты
                </Button>
              </div>
            </DetailsView.Footer>
          </form>
        </Form>
      </DetailsView.Content>
      {main_schet?.data && organization?.data && shartnomaGrafik?.data ? (
        <GenerateReportDialog
          open={reportToggle.isOpen}
          onChange={reportToggle.setOpen}
          schedule={form.watch()}
          main_schet={main_schet.data}
          organization={organization.data}
          doc_date={shartnomaGrafik.data.doc_date}
          doc_num={shartnomaGrafik.data.doc_num}
        />
      ) : null}
    </DetailsView>
  )
}

export default ShartnomaGrafikDetailsPage
