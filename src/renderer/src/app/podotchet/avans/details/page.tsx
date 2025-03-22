import type { AdvanceReportPodvodkaPayloadType } from '../constants'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { DocumentType } from '@renderer/common/features/doc-num'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSnippets } from '@renderer/common/features/snippents/use-snippets'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { Fieldset } from '@/common/components'
import { Form } from '@/common/components/ui/form'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { TypeSchetOperatsii } from '@/common/models'
import {
  DocumentFields,
  OperatsiiFields,
  OpisanieFields,
  PodotchetFields,
  SummaFields
} from '@/common/widget/form'

import {
  AdvanceReportPayloadSchema,
  AdvanceReportPodvodkaPayloadSchema,
  avansQueryKeys,
  defaultValues
} from '../constants'
import { avansService } from '../service'
import { podvodkaColumns } from './podvodki'

const AdvanceReportDetailsPage = () => {
  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'avans'
  })

  const form = useForm({
    resolver: zodResolver(AdvanceReportPayloadSchema),
    defaultValues: defaultValues
  })

  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: form.watch('spravochnik_operatsii_own_id'),
      onChange: (value) => {
        form.setValue('spravochnik_operatsii_own_id', value ?? 0, { shouldValidate: true })
      },
      params: {
        type_schet: TypeSchetOperatsii.GENERAL
      }
    })
  )

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: form.watch('id_spravochnik_podotchet_litso'),
      onChange: (value) => {
        form.setValue('id_spravochnik_podotchet_litso', value ?? 0, { shouldValidate: true })
        form.setValue('spravochnik_podotchet_litso_id', value ?? 0, { shouldValidate: true })
      }
    })
  )

  const { data: prixod, isFetching } = useQuery({
    queryKey: [
      avansQueryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: avansService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [avansQueryKeys.create],
    mutationFn: avansService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getById, id]
      })

      navigate(-1)
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [avansQueryKeys.update, id],
    mutationFn: avansService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getById, id]
      })

      navigate(-1)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    const {
      doc_date,
      doc_num,
      spravochnik_operatsii_own_id,
      spravochnik_podotchet_litso_id,
      id_spravochnik_podotchet_litso,
      opisanie
    } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        spravochnik_operatsii_own_id,
        spravochnik_podotchet_litso_id,
        id_spravochnik_podotchet_litso,
        opisanie,
        childs: podvodki.map(normalizeEmptyFields<AdvanceReportPodvodkaPayloadType>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      spravochnik_operatsii_own_id,
      spravochnik_podotchet_litso_id,
      id_spravochnik_podotchet_litso,
      opisanie,
      childs: podvodki.map(normalizeEmptyFields<AdvanceReportPodvodkaPayloadType>)
    })
  })

  const podvodki = form.watch('childs')

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.podotchet')
        },
        {
          path: '/accountable/avans',
          title: t('pages.avans')
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
        .filter((podvodka) => !isNaN(podvodka.summa))
        .reduce((acc, curr) => acc + curr.summa, 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])

  useEffect(() => {
    if (id === 'create') {
      form.reset(defaultValues)
      return
    }

    if (prixod?.data) {
      form.reset({
        ...prixod.data,
        spravochnik_podotchet_litso_id: prixod.data.id_spravochnik_podotchet_litso,
        id_spravochnik_podotchet_litso: prixod.data.id_spravochnik_podotchet_litso
      })
      return
    }

    form.reset(defaultValues)
  }, [form, prixod, id])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="grid grid-cols-2">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                  documentType={DocumentType.AVANS}
                  autoGenerate={id === 'create'}
                />
                <OperatsiiFields
                  tabIndex={2}
                  spravochnik={operatsiiSpravochnik}
                  error={form.formState.errors.spravochnik_operatsii_own_id}
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <div className="h-full bg-slate-50">
                  <PodotchetFields
                    tabIndex={3}
                    spravochnik={podotchetSpravochnik}
                    error={
                      form.formState.errors.id_spravochnik_podotchet_litso ||
                      form.formState.errors.spravochnik_podotchet_litso_id
                    }
                  />
                </div>
                <SummaFields data={{ summa: form.watch('summa') }} />
              </div>

              <div className="p-5">
                <OpisanieFields
                  tabIndex={4}
                  form={form}
                  snippets={snippets}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
                />
              </div>
            </div>

            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={6}
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
            tabIndex={5}
            columnDefs={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: AdvanceReportPodvodkaPayloadSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
            onChange={createEditorChangeHandler({
              form
            })}
          />
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default AdvanceReportDetailsPage
