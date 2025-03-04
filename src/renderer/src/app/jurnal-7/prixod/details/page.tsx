import type { PrixodImportResponse } from './types'
import type { Response } from '@renderer/common/models'

import { useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { Form } from '@renderer/common/components/ui/form'
import { DocumentType } from '@renderer/common/features/doc-num'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { formatDate, parseDate, withinMonth } from '@renderer/common/lib/date'
import { focusInvalidInput } from '@renderer/common/lib/errors'
import { HttpResponseError } from '@renderer/common/lib/http'
import { type Operatsii, TypeSchetOperatsii } from '@renderer/common/models'
import { DetailsView } from '@renderer/common/views'
import {
  DocumentFields,
  DoverennostFields,
  JONumFields,
  OpisanieFields,
  OrganizationFields,
  ResponsibleFields,
  ShartnomaFields,
  SummaFields
} from '@renderer/common/widget/form'
import { useQueryClient } from '@tanstack/react-query'
import isEmpty from 'just-is-empty'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'
import { handleOstatokResponse, validateOstatokDate } from '@/app/jurnal-7/ostatok/utils'
import { createResponsibleSpravochnik } from '@/app/jurnal-7/responsible/service'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { DownloadFile, ImportFile } from '@/common/features/file'

import { PrixodFormSchema, defaultValues, queryKeys } from '../config'
import { ErrorAlert, type ErrorData, type ErrorDataDocument } from '../error-alert'
import { usePrixodCreate, usePrixodGet, usePrixodUpdate } from '../service'
import { ProvodkaTable } from './provodka-table'

const Jurnal7PrixodDetailsPage = () => {
  const [error, setError] = useState<ErrorData>()

  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const { id } = useParams()
  const { t } = useTranslation(['app'])
  const { minDate, maxDate, recheckOstatok } = useOstatokStore()

  const { data: prixod, isFetching } = usePrixodGet(Number(id))
  const { mutate: createPrixod, isPending: isCreating } = usePrixodCreate({
    onSuccess: (res) => {
      toast.success(res?.message)
      handleOstatokResponse(res)
      navigate(-1)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      recheckOstatok?.()
    },
    onError(error) {
      console.log(error)
      if (error instanceof HttpResponseError) {
        setError({
          message: error?.message ?? '',
          document: error.meta?.[0] as ErrorDataDocument
        })
      }
      toast.error(error?.message)
    }
  })
  const { mutate: updatePrixod, isPending: isUpdating } = usePrixodUpdate({
    onSuccess(res) {
      toast.success(res?.message)
      handleOstatokResponse(res)
      navigate(-1)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      recheckOstatok?.()
    },
    onError(error) {
      console.log(error)
      if (error instanceof HttpResponseError) {
        setError({
          message: error?.message ?? '',
          document: error.meta?.[0] as ErrorDataDocument
        })
      }
      toast.error(error?.message)
    }
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(PrixodFormSchema)
  })
  const setLayout = useLayoutStore((store) => store.setLayout)
  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('kimdan_id'),
      onChange: (value, organization) => {
        form.setValue('kimdan_id', value ?? 0)
        form.trigger('kimdan_id')

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
        form.setValue('kimga_id', value ?? 0)
        form.trigger('kimga_id')
      }
    })
  )
  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('id_shartnomalar_organization'),
      onChange: (value) => {
        form.setValue('id_shartnomalar_organization', value)
        form.trigger('id_shartnomalar_organization')
      },
      params: {
        organ_id: form.watch('kimdan_id')
      }
    })
  )
  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      onChange: (_, operatsii) => {
        form.setValue('j_o_num', operatsii?.schet ?? '')
        form.trigger('j_o_num')
        form.setValue(
          'childs',
          form.getValues('childs').map((child) => ({
            ...child,
            kredit_schet: child.kredit_schet || operatsii?.schet || ''
          }))
        )
        form.trigger('childs')
      },
      params: {
        type_schet: TypeSchetOperatsii.GENERAL
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
    form.reset(prixod?.data ? prixod?.data : defaultValues)
  }, [form, prixod])

  const kimdan_id = form.watch('kimdan_id')
  useEffect(() => {
    if (kimdan_id !== prevData.current.kimdan_id && prevData.current.kimdan_id) {
      if (kimdan_id) {
        form.setValue('id_shartnomalar_organization', 0)
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

    if (!docDate || !withinMonth(docDate, minDate)) {
      form.setValue('doc_date', formatDate(minDate))
    }
  }, [id, minDate, form])

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        },
        {
          title: t('pages.prixod-docs'),
          path: '/journal-7/prixod'
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  const { errors } = form.formState
  useEffect(() => {
    if (!isEmpty(errors)) focusInvalidInput()
  }, [errors])

  return (
    <DetailsView>
      <DetailsView.Content
        loading={isFetching}
        className="w-full overflow-x-hidden"
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
                validateDate={validateOstatokDate}
                calendarProps={{
                  fromMonth: minDate,
                  toMonth: maxDate
                }}
                documentType={DocumentType.JUR7_PRIXOD}
                autoGenerate={id === 'create'}
              />
              <div className="flex items-center gap-5 flex-wrap pb-7 px-5">
                <JONumFields
                  tabIndex={2}
                  error={form.formState.errors.j_o_num}
                  spravochnik={{
                    ...operatsiiSpravochnik,
                    selected: {
                      schet: form.watch('j_o_num')
                    } as Operatsii
                  }}
                />
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
              />
            </div>
            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={9}
                disabled={isCreating || isUpdating}
              />
            </DetailsView.Footer>
          </form>
        </Form>

        <div className="p-5 pb-32 w-full overflow-hidden flex flex-col gap-5">
          <div className="flex items-center justify-end gap-2">
            <ImportFile
              url="/jur_7/doc_prixod/read"
              onSuccess={(res) => {
                const rows = (res as Response<PrixodImportResponse[]>)?.data ?? []
                form.setValue(
                  'childs',
                  rows.map((r) => ({
                    name: r.name,
                    group_jur7_id: r.group_jur7_id,
                    edin: r.edin,
                    sena: r.sena,
                    kol: r.kol,
                    summa: r.summa,
                    data_pereotsenka: form.watch('doc_date'),
                    debet_schet: r.group.schet,
                    debet_sub_schet: r.group.provodka_subschet,
                    kredit_schet: form.watch('j_o_num'),
                    kredit_sub_schet: r.group.provodka_subschet,
                    inventar_num: r.inventar_num,
                    serial_num: r.serial_num,
                    iznos: r.group?.iznos_foiz > 0,
                    eski_iznos_summa: r.eski_iznos_summa,
                    nds_foiz: r.nds_foiz
                  }))
                )
                form.trigger('childs')
              }}
            />
            <DownloadFile
              url="/jur_7/doc_prixod/template"
              fileName={`${t('pages.material-warehouse')}_${t('pages.prixod-docs')}__${t('template')}.xlsx`}
              params={{}}
              buttonText={`${t('template')}`}
            />
          </div>
          <div className="max-h-[600px] overflow-x-auto scrollbar">
            <ProvodkaTable
              form={form}
              tabIndex={8}
            />
          </div>
        </div>
      </DetailsView.Content>

      {error?.document ? (
        <ErrorAlert
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setError(undefined)
            }
          }}
          error={error}
        />
      ) : null}
    </DetailsView>
  )
}

export default Jurnal7PrixodDetailsPage
