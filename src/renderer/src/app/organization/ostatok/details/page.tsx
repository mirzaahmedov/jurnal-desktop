import type {
  OrganizationOstatokFormValues,
  OrganizationOstatokProvodkaFormValues
} from '../service'

import { useCallback, useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { DocumentType } from '@renderer/common/features/doc-num'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSnippets } from '@renderer/common/features/snippents/use-snippets'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Fieldset } from '@/common/components'
import { Form } from '@/common/components/ui/form'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { normalizeEmptyFields } from '@/common/lib/validation'
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
      value: form.watch('organ_id'),
      onChange: (value, organization) => {
        form.setValue('contract_id', 0)
        form.setValue('organ_id', value ?? 0, {
          shouldValidate: true
        })

        if (organization?.account_numbers?.length === 1) {
          form.setValue('organ_account_number_id', organization.account_numbers[0].id)
        } else {
          form.setValue('organ_account_number_id', 0)
        }

        form.setValue('organ_gazna_number_id', 0)
      }
    })
  )

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: form.watch('contract_id'),
      onChange: (value) => {
        form.setValue('contract_id', value ?? 0, {
          shouldValidate: true
        })
      },
      params: {
        organ_id: form.watch('organ_id'),
        pudratchi_bool: false
      }
    })
  )

  const { data: organOstatok, isFetching } = useQuery({
    queryKey: [organOstatokQueryKeys.getById, Number(id), { main_schet_id }],
    queryFn: organizationOstatokService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
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

  const { mutate: update, isPending: isUpdating } = useMutation({
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

  const onSubmit = form.handleSubmit(
    ({
      doc_date,
      doc_num,
      organ_id,
      organization_by_raschet_schet_id,
      shartnoma_grafik_id,
      organ_gazna_number_id,
      prixod,
      rasxod,
      contract_id,
      opisanie,
      childs
    }: OrganizationOstatokFormValues) => {
      if (id !== 'create') {
        update({
          doc_date,
          doc_num,
          organ_id,
          organ_account_number_id: organization_by_raschet_schet_id!,
          organ_gazna_number_id,
          prixod,
          rasxod,
          contract_id,
          contract_grafik_id: shartnoma_grafik_id,
          opisanie,
          childs: childs.map(normalizeEmptyFields<OrganizationOstatokProvodkaFormValues>)
        })
        return
      }
      create({
        doc_date,
        doc_num,
        organ_id,
        organ_account_number_id: organization_by_raschet_schet_id!,
        organ_gazna_number_id,
        prixod,
        rasxod,
        contract_id,
        contract_grafik_id: shartnoma_grafik_id,
        opisanie,
        childs: childs.map(normalizeEmptyFields<OrganizationOstatokProvodkaFormValues>)
      })
    }
  )

  const childs = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: OrganizationOstatokProvodkaFormValues[]) => {
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
      setPodvodki(defaultValues.childs)
      return
    }

    form.reset(organOstatok?.data ?? defaultValues)
    setPodvodki(organOstatok?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, organOstatok, id])

  console.log(form.watch(), form.formState.errors)

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isCreating || isUpdating}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">
              <DocumentFields
                tabIndex={1}
                form={form}
                documentType={DocumentType.SHOW_SERVICE}
                autoGenerate={id === 'create'}
              />
            </div>

            <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
              <OrganizationFields
                tabIndex={3}
                spravochnik={organSpravochnik}
                form={form as any}
                error={form.formState.errors.organ_id}
                name={t('buyer')}
                className="bg-slate-50"
              />
              <div className="h-full flex flex-col divide-y divide-border">
                <ShartnomaFields
                  tabIndex={4}
                  disabled={!form.watch('organ_id')}
                  form={form as any}
                  spravochnik={shartnomaSpravochnik}
                  error={form.formState.errors.contract_id}
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
            columns={podvodkaColumns}
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
