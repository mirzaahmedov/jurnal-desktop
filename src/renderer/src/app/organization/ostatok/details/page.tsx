import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createShartnomaSpravochnik } from '@/app/organization/shartnoma'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { Fieldset } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { Form } from '@/common/components/ui/form'
import { Switch } from '@/common/components/ui/switch'
import { DocumentType } from '@/common/features/doc-num'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSnippets } from '@/common/features/snippents/use-snippets'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useLayoutStore } from '@/common/layout/store'
import { DetailsView } from '@/common/views'
import {
  DocumentFields,
  OpisanieFields,
  OrganizationFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'

import { defaultValues, organOstatokQueryKeys } from '../config'
import {
  OrganizationOstatokFormSchema,
  OrganizationOstatokProvodkaFormSchema,
  organizationOstatokService
} from '../service'
import { createRequestPayload, parseResponseData } from '../utils'
import { podvodkaColumns } from './podvodki'

const OrganOstatokDetailsPage = () => {
  const { t } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'organ-ostatok'
  })

  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const form = useForm({
    resolver: zodResolver(OrganizationOstatokFormSchema),
    defaultValues
  })

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value, organization) => {
        form.setValue('shartnomalar_organization_id', 0)
        form.setValue('id_spravochnik_organization', value ?? 0, {
          shouldValidate: true
        })

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
      value: form.watch('shartnomalar_organization_id'),
      onChange: (value) => {
        form.setValue('shartnomalar_organization_id', value ?? 0, {
          shouldValidate: true
        })
      },
      params: {
        organ_id: form.watch('id_spravochnik_organization')
      }
    })
  )

  const { data: organOstatok, isFetching } = useQuery({
    queryKey: [organOstatokQueryKeys.getById, Number(id), { main_schet_id }],
    queryFn: organizationOstatokService.getById,
    enabled: id !== 'create'
  })
  const { mutate: createOstatok, isPending: isCreating } = useMutation({
    mutationKey: [organOstatokQueryKeys.create],
    mutationFn: organizationOstatokService.create,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [organOstatokQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [organOstatokQueryKeys.getById, id]
      })
      navigate('/organization/ostatok')
    }
  })

  const { mutate: updateOstatok, isPending: isUpdating } = useMutation({
    mutationKey: [organOstatokQueryKeys.update, id],
    mutationFn: organizationOstatokService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [organOstatokQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [organOstatokQueryKeys.getById, id]
      })
      navigate('/organization/ostatok')
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    const payload = createRequestPayload(values)
    if (id !== 'create') {
      updateOstatok({
        id: Number(id),
        ...payload
      })
      return
    }
    createOstatok(payload)
  })

  const childs = form.watch('childs')

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        },
        {
          path: '/organization/ostatok',
          title: t('pages.ostatok')
        }
      ],
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  const summa = useMemo(
    () => childs.reduce((total, child) => total + (child.summa ?? 0), 0),
    [childs]
  )

  useEffect(() => {
    if (id === 'create') {
      form.reset(defaultValues)
      return
    }

    if (organOstatok?.data) {
      form.reset(parseResponseData(organOstatok.data))
      return
    }

    form.reset(defaultValues)
  }, [form, organOstatok, id])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">
              <DocumentFields
                tabIndex={1}
                form={form}
                autoGenerate
                documentType={DocumentType.ORGAN_SALDO}
              />
            </div>

            <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
              <OrganizationFields
                tabIndex={3}
                spravochnik={organSpravochnik}
                form={form as any}
                error={form.formState.errors.id_spravochnik_organization}
                name={t('buyer')}
                className="bg-slate-50"
              />
              <div className="h-full flex flex-col divide-y divide-border">
                <ShartnomaFields
                  tabIndex={4}
                  disabled={!form.watch('id_spravochnik_organization')}
                  form={form as any}
                  spravochnik={shartnomaSpravochnik}
                  error={form.formState.errors.shartnomalar_organization_id}
                />
                <SummaFields data={{ summa }} />
              </div>
            </div>

            <div className="mt-5 p-5">
              <OpisanieFields
                tabIndex={5}
                form={form}
                snippets={snippets}
                addSnippet={addSnippet}
                removeSnippet={removeSnippet}
              />
            </div>

            <div className="flex items-center gap-2 px-5">
              <label className="text-sm font-medium">{t('prixod')}</label>
              <Switch
                checked={form.watch('rasxod')}
                onCheckedChange={(checked) => {
                  if (checked) {
                    form.setValue('rasxod', true)
                    form.setValue('prixod', false)
                    return
                  }
                  form.setValue('rasxod', false)
                  form.setValue('prixod', true)
                }}
              />
              <label className="text-sm font-medium">{t('rasxod')}</label>
            </div>

            <DetailsView.Footer>
              <DetailsView.Create
                tabIndex={7}
                disabled={isCreating || isUpdating}
                loading={isCreating || isUpdating}
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
              schema: OrganizationOstatokProvodkaFormSchema,
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

export default OrganOstatokDetailsPage
