import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { monthNames } from '@/common/data/month'
import { useRequisitesStore } from '@/common/features/requisites'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'
import { DetailsView } from '@/common/views'

import { SmetaGrafikFormSchema, SmetaGrafikQueryKeys, defaultValues } from '../config'
import { SmetaGrafikService } from '../service'

const SmetaGrafikDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(SmetaGrafikFormSchema)
  })

  const smetaSpravochnik = useSpravochnik(
    createSmetaSpravochnik({
      value: form.watch('smeta_id'),
      onChange: (value) => {
        form.setValue('smeta_id', value ?? 0)
      },
      params: {
        main_schet_id,
        budjet_id
      }
    })
  )

  const { data: smetaGrafik, isFetching } = useQuery({
    queryKey: [
      SmetaGrafikQueryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: SmetaGrafikService.getById,
    enabled: id !== 'create'
  })

  const { mutate: updateSmetaGrafik, isPending } = useMutation({
    mutationKey: [SmetaGrafikQueryKeys.update],
    mutationFn: SmetaGrafikService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [SmetaGrafikQueryKeys.getAll]
      })
      navigate(-1)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!budjet_id || !main_schet_id) {
      toast.error('Выберите бюджет и главный счет')
      return
    }
    updateSmetaGrafik({
      ...values,
      id: Number(id),
      spravochnik_budjet_name_id: budjet_id,
      main_schet_id
    })
  })

  useEffect(() => {
    if (smetaGrafik) {
      form.reset(smetaGrafik?.data)
      return
    }
    form.reset(defaultValues)
  }, [form, smetaGrafik])

  const values = form.watch()
  const summa = useMemo(() => {
    return monthNames.reduce((acc, { name }) => {
      return acc + (values[name] || 0)
    }, 0)
  }, [values])

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        },
        {
          title: t('pages.prixod-docs'),
          path: '/smeta-grafik'
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  console.log({ errors: form.formState.errors })

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-4 gap-5">
                <FormField
                  name="year"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={t('year')}
                    >
                      <NumericFormat
                        {...field}
                        autoFocus
                        maxLength={4}
                        customInput={Input}
                        value={field.value || ''}
                        onChange={undefined}
                        allowLeadingZeros={false}
                        allowedDecimalSeparators={[]}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormElement
                  direction="column"
                  label={t('smeta')}
                >
                  <SpravochnikInput
                    {...smetaSpravochnik}
                    className="col-span-4"
                    getInputValue={(selected) =>
                      `${selected?.smeta_number ?? ''} - ${selected?.smeta_name ?? ''}`
                    }
                  />
                </FormElement>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {monthNames.map(({ name, label }) => (
                  <FormField
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t(label)}
                      >
                        <NumericInput
                          {...field}
                          value={field.value || ''}
                          onChange={undefined}
                          onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                        />
                      </FormElement>
                    )}
                  />
                ))}
              </div>
            </div>

            <DetailsView.Footer className="flex items-center gap-5">
              <DetailsView.Create
                type="submit"
                isDisabled={isPending}
                isPending={isPending}
              >
                {t('save')}
              </DetailsView.Create>
              <h4 className="font-bold text-start">
                {t('total')}: {formatNumber(roundNumberToTwoDecimalPlaces(summa))}
              </h4>
            </DetailsView.Footer>
          </form>
        </Form>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default SmetaGrafikDetailsPage
