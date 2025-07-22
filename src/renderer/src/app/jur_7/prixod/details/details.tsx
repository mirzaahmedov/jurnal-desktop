import type { ExistingDocument, PrixodImportResult } from './interfaces'
import type { ApiResponse } from '@/common/models'

import { useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import isEmpty from 'just-is-empty'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { IznosQueryKeys } from '@/app/jur_7/iznos/config'
import { createResponsibleSpravochnik } from '@/app/jur_7/responsible/service'
import { SaldoQueryKeys } from '@/app/jur_7/saldo'
import { handleOstatokExistingDocumentError, handleOstatokResponse } from '@/app/jur_7/saldo/utils'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { Form } from '@/common/components/ui/form'
import { DocumentType } from '@/common/features/doc-num'
import { DownloadFile, ImportFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSnippets } from '@/common/features/snippents/use-snippets'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatDate, parseDate, withinMonth } from '@/common/lib/date'
import { focusInvalidInput } from '@/common/lib/errors'
import { DetailsView } from '@/common/views'
import {
  DocumentFields,
  DoverennostFields,
  OpisanieFields,
  OrganizationFields,
  ResponsibleFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'

import { TotalsOverview } from '../../__components__/totals-overview'
import { MaterialPrixodFormSchema, MaterialPrixodQueryKeys, defaultValues } from '../config'
import { MaterialPrixodService, usePrixodCreate, usePrixodUpdate } from '../service'
import { ApplyAllInputs } from './apply-all-inputs'
import { ExistingDocumentsAlert } from './existing-document-alert'
import { ProvodkaTable } from './provodka-table'
import { changeOpisanieContract, changeOpisanieSchetFaktura } from './utils'

interface PrixodDetailsProps {
  id: string | undefined
  onSuccess?: VoidFunction
}
const PrixodDetails = ({ id, onSuccess }: PrixodDetailsProps) => {
  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const queryClient = useQueryClient()

  const [existingDocsError, setExistingDocsError] = useState<{
    message: string
    docs: ExistingDocument[]
  }>()

  const { t } = useTranslation(['app'])
  const { startDate, endDate } = useSelectedMonthStore()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'jur7_prixod'
  })

  const { data: prixod, isFetching } = useQuery({
    queryKey: [
      MaterialPrixodQueryKeys.getById,
      Number(id),
      {
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: MaterialPrixodService.getById,
    enabled: !!id
  })
  const { mutate: createPrixod, isPending: isCreating } = usePrixodCreate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)

      queryClient.invalidateQueries({
        queryKey: [MaterialPrixodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })

      onSuccess?.()
    }
  })
  const { mutate: updatePrixod, isPending: isUpdating } = usePrixodUpdate({
    onSuccess(res) {
      toast.success(res?.message)
      handleOstatokResponse(res)

      queryClient.invalidateQueries({
        queryKey: [MaterialPrixodQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.check]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })

      onSuccess?.()
    },
    onError(error) {
      const result = handleOstatokExistingDocumentError<ExistingDocument>(error)
      if (result) {
        setExistingDocsError({
          message: error.message,
          docs: result.docs
        })
      } else {
        setExistingDocsError(undefined)
      }
    }
  })

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      doc_date: formatDate(startDate)
    },
    resolver: zodResolver(MaterialPrixodFormSchema)
  })

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('kimdan_id'),
      onChange: (value, organization) => {
        form.setValue('kimdan_id', value ?? 0, { shouldValidate: true })

        if (organization?.account_numbers?.length === 1) {
          form.setValue('organization_by_raschet_schet_id', organization.account_numbers[0].id)
        } else {
          form.setValue('organization_by_raschet_schet_id', 0)
        }

        form.setValue('organization_by_raschet_schet_gazna_id', 0)
      }
    })
  )
  const responsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('kimga_id'),
      onChange: (value) => {
        form.setValue('kimga_id', value ?? 0, { shouldValidate: true })
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
        organ_id: form.watch('kimdan_id')
      }
    })
  )

  const onSubmit = form.handleSubmit((values) => {
    if (id === 'create') {
      createPrixod(values)
      return
    }
    updatePrixod({ id: Number(id), ...values })
  })

  const values = form.watch()
  const summa = useMemo(() => {
    if (!Array.isArray(values.childs)) {
      return
    }
    return values.childs.reduce((acc, { summa = 0 }) => acc + summa, 0)
  }, [values])

  useEffect(() => {
    if (prixod?.data) {
      form.reset(prixod?.data)
    }
  }, [form, prixod])

  const kimdan_id = form.watch('kimdan_id')
  useEffect(() => {
    if (kimdan_id !== prevData.current.kimdan_id && prevData.current.kimdan_id) {
      if (kimdan_id) {
        form.setValue('id_shartnomalar_organization', 0, { shouldValidate: true })
        prevData.current.kimdan_id = kimdan_id
      }
      prevData.current.kimdan_id = kimdan_id
    }
  }, [form, kimdan_id])
  const doc_date = form.watch('doc_date')
  useEffect(() => {
    form.setValue(
      'childs',
      form.getValues('childs').map((child) => ({
        ...child,
        data_pereotsenka: child.data_pereotsenka ? child.data_pereotsenka : doc_date,
        iznos_start: child.iznos ? (child.iznos_start ?? doc_date) : ''
      }))
    )
  }, [form, doc_date])
  useEffect(() => {
    if (id !== 'create') {
      return
    }
    const docDate = parseDate(form.watch('doc_date'))

    if (!docDate || !withinMonth(docDate, startDate)) {
      form.setValue('doc_date', formatDate(startDate))
    }
  }, [id, startDate, form])

  const { errors } = form.formState
  useEffect(() => {
    if (!isEmpty(errors)) focusInvalidInput()
  }, [errors])

  const childs = useWatch({
    control: form.control,
    name: 'childs'
  })
  const totals = useMemo(() => {
    const results = {
      total: 0,
      _01: 0,
      _06: 0,
      _07: 0,
      iznos: 0
    }
    childs.forEach((child) => {
      results.total += child.summa || 0
      if (child.debet_schet.startsWith('01')) {
        results._01 += child.summa || 0
      } else if (child.debet_schet.startsWith('06')) {
        results._06 += child.summa || 0
      } else if (child.debet_schet.startsWith('07')) {
        results._07 += child.summa || 0
      }
      results.iznos += child.eski_iznos_summa || 0
    })
    return results
  }, [childs])

  useEffect(() => {
    changeOpisanieSchetFaktura({
      form,
      doc_num: form.watch('doc_num'),
      doc_date: form.watch('doc_date')
    })
  }, [form, form.watch('doc_num'), form.watch('doc_date')])

  return (
    <DetailsView>
      <DetailsView.Content
        isLoading={isFetching}
        className="w-full overflow-x-hidden pb-20"
      >
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="divide-y"
          >
            <div className="grid grid-cols-2 items-end">
              <DocumentFields
                tabIndex={1}
                form={form}
                calendarProps={
                  id === 'create'
                    ? {
                        fromMonth: startDate,
                        toMonth: endDate
                      }
                    : undefined
                }
                validateDate={id === 'create' ? validateDateWithinSelectedMonth : undefined}
                documentType={DocumentType.JUR7_PRIXOD}
                autoGenerate={id === 'create'}
              />
              <div className="flex items-center gap-5 flex-wrap pb-7 px-5">
                <DoverennostFields
                  tabIndex={3}
                  form={form}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x">
              <OrganizationFields
                tabIndex={4}
                name={t('from-who')}
                spravochnik={orgSpravochnik}
                form={form as any}
                error={form.formState.errors.kimdan_id}
                className="bg-gray-50"
              />
              <ResponsibleFields
                tabIndex={5}
                name={t('to-whom')}
                spravochnik={responsibleSpravochnik}
                error={form.formState.errors.kimga_id}
              />
            </div>
            <div className="grid grid-cols-2">
              <ShartnomaFields
                tabIndex={6}
                disabled={!form.watch('kimdan_id')}
                spravochnik={shartnomaSpravochnik}
                error={form.formState.errors.id_shartnomalar_organization}
                form={form as any}
              />
              <SummaFields
                data={{
                  summa
                }}
              />
            </div>
            <div className="p-5">
              <OpisanieFields
                tabIndex={7}
                form={form}
                snippets={snippets}
                addSnippet={addSnippet}
                removeSnippet={removeSnippet}
              />
            </div>
            <DetailsView.Footer>
              <DetailsView.Create isDisabled={isCreating || isUpdating} />
            </DetailsView.Footer>
          </form>
        </Form>

        <div className="p-5 w-full overflow-hidden flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <ImportFile
                url="/jur_7/doc_prixod/read"
                onSuccess={(res) => {
                  const rows = (res as ApiResponse<PrixodImportResult[]>)?.data ?? []
                  form.setValue(
                    'childs',
                    rows.map((r) => ({
                      name: r.name,
                      group_jur7_id: r.group_jur7_id,
                      sena: r.sena,
                      kol: r.kol,
                      summa: r.summa,
                      data_pereotsenka: form.watch('doc_date'),
                      debet_schet: r.group.schet,
                      debet_sub_schet: r.group.provodka_subschet,
                      kredit_schet: '',
                      kredit_sub_schet: r.group.provodka_subschet,
                      inventar_num: r.inventar_num,
                      serial_num: r.serial_num,
                      iznos: r.group?.iznos_foiz > 0,
                      eski_iznos_summa: r.eski_iznos_summa,
                      iznos_start: r.iznos ? form.getValues('doc_date') : '',
                      iznos_schet: r.iznos ? r.iznos_schet : '',
                      iznos_sub_schet: r.iznos ? r.iznos_sub_schet : '',
                      nds_foiz: r.nds_foiz,
                      unit_id: r.unit_id
                    })),
                    { shouldValidate: true }
                  )
                }}
              />
              <DownloadFile
                url="/jur_7/doc_prixod/template"
                fileName={`${t('pages.material-warehouse')}_${t('pages.prixod-docs')}__${t('template')}.xlsx`}
                params={{}}
                buttonText={`${t('template')}`}
              />
            </div>
            <ApplyAllInputs
              onApply={({ schet }) => {
                form.getValues('childs').forEach((_, index) => {
                  form.setValue(`childs.${index}.kredit_schet`, schet, { shouldValidate: true })
                })
              }}
            />
          </div>
          <ProvodkaTable
            form={form}
            tabIndex={8}
          />
          <TotalsOverview
            total={totals.total}
            _01={totals._01}
            _06={totals._06}
            _07={totals._07}
            iznos={totals.iznos}
          />
        </div>
      </DetailsView.Content>

      {existingDocsError ? (
        <ExistingDocumentsAlert
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setExistingDocsError(undefined)
            }
          }}
          docs={existingDocsError.docs}
          message={existingDocsError.message}
        />
      ) : null}
    </DetailsView>
  )
}

export default PrixodDetails
