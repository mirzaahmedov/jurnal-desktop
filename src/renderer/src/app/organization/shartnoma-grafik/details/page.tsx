import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { mainSchetQueryKeys, mainSchetService } from '@renderer/app/region-spravochnik/main-schet'
import {
  organizationQueryKeys,
  organizationService
} from '@renderer/app/region-spravochnik/organization'
import { createSmetaSpravochnik } from '@renderer/app/super-admin/smeta'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { SmetaFields } from '@renderer/common/widget/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { type Location, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { shartnomaQueryKeys, shartnomaService } from '@/app/organization/shartnoma'
import { DatePicker, Fieldset, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { monthNames } from '@/common/data/month'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'
import { formatNumber } from '@/common/lib/format'
import { cn, numberToWords, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'
import { DetailsView } from '@/common/views'

import { defaultValues, shartnomaGrafikQueryKeys } from '../constants'
import {
  type LocationState,
  ShartnomaGrafikFormSchema,
  type ShartnomaGrafikFormValues,
  shartnomaGrafikDetailsService
} from '../service'
import { GenerateReportDialog } from '../templates/report-dialog/dialog'

const ShartnomaGrafikDetailsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const reportToggle = useToggle()

  const params = useParams()
  const location = useLocation() as Location<LocationState>
  const org_id = location.state?.org_id

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])

  const form = useForm<ShartnomaGrafikFormValues>({
    resolver: zodResolver(ShartnomaGrafikFormSchema),
    defaultValues
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      value: form.watch('smeta_id' as any),
      onChange: (id) => {
        form.setValue('smeta_id' as any, id)
      }
    })
  )

  const { data: main_schet } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById
  })
  const { data: organization } = useQuery({
    queryKey: [organizationQueryKeys.getById, Number(org_id)],
    queryFn: organizationService.getById
  })
  const { data: shartnomaGrafik, isFetching } = useQuery({
    queryKey: [
      shartnomaGrafikQueryKeys.getById,
      Number(params.id),
      {
        main_schet_id
      }
    ],
    queryFn: shartnomaGrafikDetailsService.getById,
    enabled: params.id !== 'create' && !!main_schet_id
  })
  const { data: shartnoma } = useQuery({
    queryKey: [
      shartnomaQueryKeys.getById,
      Number(location.state.shartnoma_id),
      {
        main_schet_id
      }
    ],
    queryFn: shartnomaService.getById,
    enabled: params.id === 'create' && !!main_schet_id && !!location.state.shartnoma_id
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [shartnomaGrafikQueryKeys.update],
    mutationFn: shartnomaGrafikDetailsService.update,
    onSuccess() {
      toast.success('Документ успешно обновлен')

      queryClient.invalidateQueries({
        queryKey: [shartnomaGrafikQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaGrafikQueryKeys.getById, params.id]
      })

      navigate(`/organization/shartnoma-grafik`)
    },
    onError(error) {
      toast.error('Произошла ошибка при обновлении документа: ' + error.message)
    }
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [shartnomaGrafikQueryKeys.create],
    mutationFn: shartnomaGrafikDetailsService.create,
    onSuccess() {
      toast.success('Документ успешно обновлен')

      queryClient.invalidateQueries({
        queryKey: [shartnomaGrafikQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaGrafikQueryKeys.getById, params.id]
      })

      navigate(`/organization/shartnoma-grafik`)
    },
    onError(error) {
      toast.error('Произошла ошибка при обновлении документа: ' + error.message)
    }
  })

  const onSubmit = form.handleSubmit(
    ({
      oy_1,
      oy_2,
      oy_3,
      oy_4,
      oy_5,
      oy_6,
      oy_7,
      oy_8,
      oy_9,
      oy_10,
      oy_11,
      oy_12,
      smeta_id,
      id_shartnomalar_organization
    }) => {
      if (params.id === 'create') {
        create({
          oy_1,
          oy_2,
          oy_3,
          oy_4,
          oy_5,
          oy_6,
          oy_7,
          oy_8,
          oy_9,
          oy_10,
          oy_11,
          oy_12,
          smeta_id,
          id_shartnomalar_organization
        })
        return
      }
      update({
        id: Number(params.id),
        oy_1,
        oy_2,
        oy_3,
        oy_4,
        oy_5,
        oy_6,
        oy_7,
        oy_8,
        oy_9,
        oy_10,
        oy_11,
        oy_12,
        smeta_id,
        id_shartnomalar_organization
      })
    }
  )

  useEffect(() => {
    if (!shartnomaGrafik?.data) {
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
      oy_12: data.oy_12 ?? 0,
      smeta_id: data?.smeta_id ?? 0,
      id_shartnomalar_organization: data?.id_shartnomalar_organization ?? 0
    })
  }, [form, shartnomaGrafik])

  const payload = form.watch()
  const summa = useMemo(() => {
    return [
      payload.oy_1,
      payload.oy_2,
      payload.oy_3,
      payload.oy_4,
      payload.oy_5,
      payload.oy_6,
      payload.oy_7,
      payload.oy_8,
      payload.oy_9,
      payload.oy_10,
      payload.oy_11,
      payload.oy_12
    ].reduce((result, value) => roundNumberToTwoDecimalPlaces(result + value), 0)
  }, [payload])

  useEffect(() => {
    setLayout({
      title: t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        },
        {
          title: t('pages.shartnoma-grafik'),
          path: '/organization/shartnoma-grafik'
        }
      ],
      onBack() {
        navigate('/organization/shartnoma-grafik')
      }
    })
  }, [navigate, setLayout, t, org_id])

  useEffect(() => {
    if (!org_id) {
      toast.error('Выберите организацию')
      navigate(`/organization/shartnoma-grafik`)
    }
  }, [org_id])
  useEffect(() => {
    if (params.id !== 'create') {
      return
    }

    if (!location.state?.shartnoma_id) {
      toast.error('Invalid contract id')
      navigate(`/organization/shartnoma-grafik`)
      return
    }

    form.setValue('id_shartnomalar_organization', location.state.shartnoma_id)
  }, [form, params.id, location.state?.shartnoma_id])

  const difference = summa - (shartnomaGrafik?.data?.summa ?? 0)

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="flex">
                <Fieldset
                  name={t('payment_docs')}
                  className="pr-0"
                >
                  <div className="flex items-center gap-5 flex-wrap">
                    <FormElement label={t('doc_num')}>
                      <Input
                        readOnly
                        value={shartnomaGrafik?.data?.doc_num ?? shartnoma?.data?.doc_num}
                      />
                    </FormElement>
                    <FormElement label={t('doc_date')}>
                      <DatePicker
                        readOnly
                        value={shartnomaGrafik?.data?.doc_date ?? shartnoma?.data?.doc_date}
                      />
                    </FormElement>
                  </div>
                </Fieldset>
                <SmetaFields
                  tabIndex={3}
                  error={form.formState.errors.smeta_id}
                  spravochnik={smetaSpravochnik}
                />
              </div>
              <Fieldset name={t('prixod')}>
                <div className="flex items-start gap-5">
                  <div className="flex flex-col gap-5">
                    <FormElement label={t('summa')}>
                      <Input
                        readOnly
                        value={formatNumber(shartnomaGrafik?.data?.summa ?? 0)}
                        className="text-right"
                      />
                    </FormElement>
                  </div>

                  <Textarea
                    readOnly
                    className="flex-1 max-w-2xl"
                    rows={4}
                    value={numberToWords(shartnomaGrafik?.data?.summa ?? 0)}
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
                        <FormLabel>{t(label)}</FormLabel>
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
                <DetailsView.Create />
                {shartnomaGrafik?.data && difference ? (
                  <p className="flex items-center gap-5">
                    <b className="text-sm text-slate-500">{t('difference')}:</b>
                    <span
                      className={cn(
                        'font-bold',
                        difference > 0 && 'text-emerald-500',
                        difference < 0 && 'text-red-500'
                      )}
                    >
                      {formatNumber(difference)}
                    </span>
                  </p>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={reportToggle.open}
                  disabled={
                    !main_schet?.data ||
                    !organization?.data ||
                    !shartnomaGrafik?.data ||
                    isUpdating ||
                    isCreating
                  }
                >
                  <DownloadIcon className="btn-icon icon-start" />
                  {t('payment-schedule')}
                </Button>
              </div>
            </DetailsView.Footer>
          </form>
        </Form>
      </DetailsView.Content>
      {main_schet?.data && organization?.data && shartnomaGrafik?.data ? (
        <GenerateReportDialog
          subschet={shartnomaGrafik.data.sub_schet ?? ''}
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
