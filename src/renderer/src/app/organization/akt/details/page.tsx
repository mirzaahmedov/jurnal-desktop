import type { AktFormValues, AktProvodkaFormValues } from '../service'

import { useCallback, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { createOperatsiiSpravochnik } from '@renderer/app/super-admin/operatsii'
import { Fieldset } from '@renderer/common/components'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { Form } from '@renderer/common/components/ui/form'
import { DocumentType } from '@renderer/common/features/doc-num'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSnippets } from '@renderer/common/features/snippents/use-snippets'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { useToast } from '@renderer/common/hooks/use-toast'
import { normalizeEmptyFields } from '@renderer/common/lib/validation'
import { TypeSchetOperatsii } from '@renderer/common/models'
import {
  DocumentFields,
  OperatsiiFields,
  OpisanieFields,
  OrganizationFields,
  ShartnomaFields,
  SummaFields
} from '@renderer/common/widget/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { DetailsView } from '@/common/views'

import { defaultValues, queryKeys } from '../config'
import { AktFormSchema, AktProvodkaFormSchema, aktService } from '../service'
import { podvodkaColumns } from './provodki'

const AktDetailsPage = () => {
  const { toast } = useToast()
  const { t } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'akt'
  })

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(AktFormSchema),
    defaultValues: defaultValues
  })

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value, organization) => {
        form.setValue('shartnomalar_organization_id', 0)
        form.setValue('id_spravochnik_organization', value ?? 0)
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

  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: form.watch('spravochnik_operatsii_own_id'),
      onChange: (value) => {
        form.setValue('spravochnik_operatsii_own_id', value ?? 0)
        form.trigger('spravochnik_operatsii_own_id')
      },
      params: {
        type_schet: TypeSchetOperatsii.GENERAL
      }
    })
  )

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('shartnomalar_organization_id'),
      onChange: (value) => {
        form.setValue('shartnomalar_organization_id', value)
        form.trigger('shartnomalar_organization_id')
      },
      params: {
        organ_id: form.watch('id_spravochnik_organization'),
        pudratchi_bool: true
      }
    })
  )

  const { data: akt, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: aktService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: aktService.create,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate('/organization/akt')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update, id],
    mutationFn: aktService.update,
    onSuccess() {
      toast({ title: 'Документ успешно обновлен' })

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate('/organization/akt')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const onSubmit = form.handleSubmit((payload: AktFormValues) => {
    const {
      doc_date,
      doc_num,
      id_spravochnik_organization,
      spravochnik_operatsii_own_id,
      shartnoma_grafik_id,
      shartnomalar_organization_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      opisanie,
      summa
    } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        spravochnik_operatsii_own_id,
        shartnomalar_organization_id,
        shartnoma_grafik_id,
        id_spravochnik_organization,
        organization_by_raschet_schet_id,
        organization_by_raschet_schet_gazna_id,
        opisanie,
        summa,
        childs: podvodki.map(normalizeEmptyFields<AktProvodkaFormValues>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      spravochnik_operatsii_own_id,
      shartnomalar_organization_id,
      id_spravochnik_organization,
      shartnoma_grafik_id,
      organization_by_raschet_schet_id,
      organization_by_raschet_schet_gazna_id,
      opisanie,
      summa,
      childs: podvodki.map(normalizeEmptyFields<AktProvodkaFormValues>)
    })
  })

  const podvodki = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: AktProvodkaFormValues[]) => {
      form.setValue('childs', payload)
    },
    [form]
  )

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        },
        {
          path: '/organization/akt',
          title: t('pages.akt')
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  useEffect(() => {
    const summa =
      podvodki
        .filter((podvodka) => !isNaN(Number(podvodka?.kol)) && !isNaN(Number(podvodka?.sena)))
        .reduce((acc, curr) => acc + (curr?.kol || 0) * (curr?.sena || 0), 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])

  useEffect(() => {
    if (id === 'create') {
      form.reset(defaultValues)
      setPodvodki(defaultValues.childs)
      return
    }

    form.reset(akt?.data ?? defaultValues)
    setPodvodki(akt?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, akt, id])

  console.log({ errors: form.formState.errors })

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isCreating || isUpdating}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="grid grid-cols-2">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                  documentType={DocumentType.AKT}
                  autoGenerate={id === 'create'}
                />
                <OperatsiiFields
                  tabIndex={2}
                  spravochnik={operatsiiSpravochnik}
                  error={form.formState.errors.spravochnik_operatsii_own_id}
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <OrganizationFields
                  tabIndex={3}
                  spravochnik={orgSpravochnik}
                  form={form as any}
                  error={form.formState.errors.id_spravochnik_organization}
                  name={t('supplier')}
                  className="bg-slate-50"
                />
                <div className="h-full flex flex-col divide-y divide-border">
                  <ShartnomaFields
                    tabIndex={4}
                    disabled={!form.watch('id_spravochnik_organization')}
                    spravochnik={shartnomaSpravochnik}
                    form={form as any}
                    error={form.formState.errors.shartnomalar_organization_id}
                  />
                  <SummaFields data={{ summa: form.watch('summa') }} />
                </div>
              </div>

              <div className="p-5 mt-5">
                <OpisanieFields
                  tabIndex={5}
                  form={form}
                  snippets={snippets}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
                />
              </div>
            </div>

            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={7}
                disabled={isCreating || isUpdating}
              />
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name={t('provodka')}
          className="flex-1 mt-10 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={6}
            columnDefs={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: AktProvodkaFormSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onChange={createEditorChangeHandler({
              form
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
          />
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default AktDetailsPage
