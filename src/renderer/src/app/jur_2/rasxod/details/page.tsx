import type { BankRasxodFormValues, BankRasxodPodvodkaFormValues } from '../service'
import type { BankRasxod } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppWindow } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { type Location, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { MainSchetQueryKeys, MainSchetService } from '@/app/region-spravochnik/main-schet'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { AccountBalance, Fieldset } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form } from '@/common/components/ui/form'
import { DocumentType } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSnippets } from '@/common/features/snippents/use-snippets'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { DetailsView } from '@/common/views'
import {
  DocumentFields,
  MainSchetFields,
  OpisanieFields,
  OrganizationFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'

import { BankMonitorQueryKeys, BankMonitorService } from '../../monitor'
import { useBankSaldo } from '../../saldo/components/use-saldo'
import { BankRasxodQueryKeys, defaultValues } from '../config'
import { BankRasxodFormSchema, BankRasxodPodvodkaFormSchema, BankRasxodService } from '../service'
import { ImportPlastik } from '../zarplata/import-plastik'
import { podvodkaColumns } from './podvodki'
import { changeOpisanieContract, changeOpisanieOperatsii } from './utils'

const BankRasxodDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const importDialogToggle = useToggle()

  const location = useLocation() as Location<{ original?: BankRasxod }>

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayout()

  const original = location.state?.original
  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const { t } = useTranslation(['app'])
  const { queuedMonths } = useBankSaldo()
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'bank_rasxod'
  })

  const form = useForm({
    resolver: zodResolver(BankRasxodFormSchema),
    defaultValues: {
      ...defaultValues,
      doc_date: original?.doc_date ?? formatDate(startDate) ?? defaultValues.doc_date,
      id_shartnomalar_organization:
        original?.id_shartnomalar_organization ?? defaultValues.id_shartnomalar_organization,
      id_spravochnik_organization:
        original?.id_spravochnik_organization ?? defaultValues.id_spravochnik_organization,
      opisanie: original?.opisanie ?? defaultValues.opisanie,
      rukovoditel: original?.rukovoditel ?? defaultValues.rukovoditel,
      glav_buxgalter: original?.glav_buxgalter ?? defaultValues.glav_buxgalter
    } satisfies BankRasxodFormValues as BankRasxodFormValues
  })

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value, organization) => {
        form.setValue('id_spravochnik_organization', value ?? 0)
        form.setValue('id_shartnomalar_organization', 0)
        form.trigger('id_spravochnik_organization')

        if (organization?.account_numbers?.length === 1) {
          form.setValue('organization_by_raschet_schet_id', organization.account_numbers[0].id)
        } else {
          form.setValue('organization_by_raschet_schet_id', 0)
        }

        form.setValue('organization_by_raschet_schet_gazna_id', 0)
      }
    })
  )

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('id_shartnomalar_organization'),
      onChange: (value, contract) => {
        form.setValue('id_shartnomalar_organization', value, { shouldValidate: true })
        changeOpisanieContract({
          form,
          contract
        })
      },
      params: {
        organ_id: form.watch('id_spravochnik_organization')
      }
    })
  )

  const { data: main_schet } = useQuery({
    queryKey: [MainSchetQueryKeys.getAll, main_schet_id],
    queryFn: MainSchetService.getById
  })

  const { data: monitor, isFetching: isFetchingMonitor } = useQuery({
    queryKey: [
      BankMonitorQueryKeys.getAll,
      {
        main_schet_id,
        limit: 1,
        page: 1,
        year,
        month,
        from: formatDate(startDate),
        to: form.watch('doc_date')
      }
    ],
    queryFn: BankMonitorService.getAll,
    enabled: !!main_schet_id && !queuedMonths.length && !!form.watch('doc_date')
  })

  const {
    data: rasxod,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      BankRasxodQueryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: BankRasxodService.getById,
    enabled: id !== 'create' && !!main_schet_id && !queuedMonths.length
  })
  const { mutate: createRasxod, isPending: isCreating } = useMutation({
    mutationFn: BankRasxodService.create,
    onSuccess(res) {
      toast.success(res?.message)

      navigate(-1)

      queryClient.invalidateQueries({
        queryKey: [BankRasxodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [BankRasxodQueryKeys.getById, id]
      })

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, err)
    }
  })
  const { mutate: updateRasxod, isPending: isUpdating } = useMutation({
    mutationFn: BankRasxodService.update,
    onSuccess(res) {
      toast.success(res?.message)

      navigate(-1)

      queryClient.invalidateQueries({
        queryKey: [BankRasxodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [BankRasxodQueryKeys.getById, id]
      })

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, err)
    }
  })

  const onSubmit = form.handleSubmit(
    ({
      doc_date,
      doc_num,
      id_spravochnik_organization,
      opisanie,
      rukovoditel,
      glav_buxgalter,
      id_shartnomalar_organization,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      summa
    }: BankRasxodFormValues) => {
      if (id !== 'create') {
        updateRasxod({
          id: Number(id),
          doc_date,
          doc_num,
          id_spravochnik_organization,
          id_shartnomalar_organization,
          summa: summa,
          opisanie,
          rukovoditel,
          glav_buxgalter,
          shartnoma_grafik_id,
          organization_by_raschet_schet_id,
          organization_by_raschet_schet_gazna_id,
          childs: podvodki.map(normalizeEmptyFields<BankRasxodPodvodkaFormValues>)
        })
        return
      }
      createRasxod({
        doc_date,
        doc_num,
        id_spravochnik_organization,
        id_shartnomalar_organization,
        summa,
        opisanie,
        rukovoditel,
        glav_buxgalter,
        shartnoma_grafik_id,
        organization_by_raschet_schet_id,
        organization_by_raschet_schet_gazna_id,
        childs: podvodki.map(normalizeEmptyFields<BankRasxodPodvodkaFormValues>)
      })
    }
  )

  const podvodki = useWatch({
    control: form.control,
    name: 'childs'
  })
  const operatsii = podvodki.map((row) => ({
    schet: row.schet,
    sub_schet: row.sub_schet
  }))

  const summa = form.watch('summa')
  const reminder = monitor?.meta
    ? (monitor?.meta?.summa_to ?? 0) - (summa ?? 0) + (rasxod?.data?.summa ?? 0)
    : 0

  useEffect(() => {
    const summa =
      podvodki
        .filter((podvodka) => !isNaN(podvodka.summa))
        .reduce((acc, curr) => acc + curr.summa, 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])
  useEffect(() => {
    changeOpisanieOperatsii({
      form,
      operatsii
    })
  }, [form, JSON.stringify(operatsii)])

  useEffect(() => {
    if (id === 'create') {
      return
    }

    form.reset({
      ...(rasxod?.data ?? defaultValues),
      childs:
        rasxod?.data?.childs?.map((child) => ({
          ...child,
          summa: (child.tulanmagan_summa || summa) ?? 0
        })) ?? defaultValues.childs
    })
  }, [form, rasxod, id])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  }, [error])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.bank')
        },
        {
          path: '/bank/rasxod',
          title: t('pages.rasxod-docs')
        }
      ],
      enableSaldo: true,
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])
  useEffect(() => {
    form.setValue('organization_porucheniya_name', organSpravochnik.selected?.name ?? '')
  }, [form, organSpravochnik.selected])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="flex">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                  autoGenerate={id === 'create'}
                  documentType={DocumentType.BANK_RASXOD}
                  validateDate={id === 'create' ? validateDateWithinSelectedMonth : undefined}
                  calendarProps={
                    id === 'create'
                      ? {
                          fromMonth: startDate,
                          toMonth: startDate
                        }
                      : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <MainSchetFields
                  main_schet={main_schet?.data}
                  name={t('payer-info')}
                />
                <OrganizationFields
                  displayGazna
                  form={form as any}
                  tabIndex={2}
                  error={form.formState.errors.id_spravochnik_organization}
                  spravochnik={organSpravochnik}
                  disabled={isFetching}
                  className="bg-slate-50"
                  name={t('receiver-info')}
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <SummaFields data={{ summa: form.watch('summa') }} />
                <ShartnomaFields
                  tabIndex={3}
                  disabled={!form.watch('id_spravochnik_organization')}
                  spravochnik={shartnomaSpravochnik}
                  form={form as any}
                  error={form.formState.errors.id_shartnomalar_organization}
                />
              </div>

              <div className="-mt-5 p-5">
                <OpisanieFields
                  tabIndex={4}
                  form={form}
                  snippets={snippets}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
                />
              </div>
            </div>

            <DetailsView.Footer className="flex flex-row gap-5">
              <DetailsView.Create
                isDisabled={reminder < 0 || isFetchingMonitor || isFetching}
                isPending={isCreating || isUpdating}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  importDialogToggle.open()
                }}
              >
                <AppWindow className="btn-icon icon-start" /> {t('choose_zarplata')}
              </Button>

              {summa ? <AccountBalance balance={reminder} /> : null}
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-5 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={6}
            form={form}
            name="childs"
            columnDefs={podvodkaColumns}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: BankRasxodPodvodkaFormSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
          />
        </Fieldset>
      </DetailsView.Content>

      <DialogTrigger
        isOpen={importDialogToggle.isOpen}
        onOpenChange={importDialogToggle.setOpen}
      >
        <DialogOverlay>
          <DialogContent className="w-full max-w-[1820px] h-full max-h-[980px] flex flex-col">
            <DialogHeader>
              <DialogTitle>{t('import_zarplata')}</DialogTitle>
            </DialogHeader>
            <ImportPlastik
              onSelect={({ opisanie, childs }) => {
                form.setValue('opisanie', opisanie, { shouldValidate: true })
                form.setValue(
                  'childs',
                  childs.map(({ summa }) => ({
                    spravochnik_operatsii_id: 0,
                    summa
                  })),
                  { shouldValidate: true }
                )
                importDialogToggle.close()
              }}
            />
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </DetailsView>
  )
}

export default BankRasxodDetailsPage
