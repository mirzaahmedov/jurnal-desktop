import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { EditableTable } from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { Switch } from '@renderer/common/components/ui/switch'
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
import { DetailsView } from '@/common/views'
import { DocumentFields, OpisanieFields, SummaFields } from '@/common/widget/form'

import { bankOstatokQueryKeys, defaultValues } from '../config'
import {
  BankOstatokFormSchema,
  BankOstatokProvodkaFormSchema,
  bankOstatokService
} from '../service'
import { createRequestPayload, parseResponseData } from '../utils'
import { provodkaColumns } from './podvodki'

const BankOstatokDetailsPage = () => {
  const { t } = useTranslation(['app'])
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'organ-ostatok'
  })

  const id = useParams<{ id: string }>().id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const form = useForm({
    resolver: zodResolver(BankOstatokFormSchema),
    defaultValues
  })

  const { data: bankOstatok, isFetching } = useQuery({
    queryKey: [bankOstatokQueryKeys.getById, Number(id), { main_schet_id }],
    queryFn: bankOstatokService.getById,
    enabled: id !== 'create'
  })
  const { mutate: createOstatok, isPending: isCreating } = useMutation({
    mutationKey: [bankOstatokQueryKeys.create],
    mutationFn: bankOstatokService.create,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [bankOstatokQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [bankOstatokQueryKeys.getById, id]
      })
      navigate(-1)
    }
  })

  const { mutate: updateOstatok, isPending: isUpdating } = useMutation({
    mutationKey: [bankOstatokQueryKeys.update, id],
    mutationFn: bankOstatokService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [bankOstatokQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [bankOstatokQueryKeys.getById, id]
      })
      navigate(-1)
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
          title: t('pages.bank')
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

    if (bankOstatok?.data) {
      form.reset(parseResponseData(bankOstatok.data))
      return
    }

    form.reset(defaultValues)
  }, [form, bankOstatok, id])

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
              <div className="h-full flex flex-col divide-y divide-border">
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
            columnDefs={provodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: BankOstatokProvodkaFormSchema,
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

export default BankOstatokDetailsPage
