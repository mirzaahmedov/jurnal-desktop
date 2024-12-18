import type { PokazatUslugiForm, PokazatUslugiProvodkaForm } from '../service'

import {
  PokazatUslugiFormSchema,
  PokazatUslugiProvodkaFormSchema,
  pokazatUslugiService
} from '../service'
import { useCallback, useEffect } from 'react'
import { useSpravochnik } from '@/common/features/spravochnik'
import { Form } from '@/common/components/ui/form'
import { TypeSchetOperatsii } from '@/common/models'
import { useToast } from '@/common/hooks/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys, defaultValues } from '../constants'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import {
  OperatsiiFields,
  ShartnomaFields,
  DocumentFields,
  OpisanieFields,
  OrganizationFields,
  SummaFields
} from '@/common/widget/form'
import { Fieldset } from '@/common/components'
import { EditableTable } from '@/common/features/editable-table'
import { podvodkaColumns } from './podvodki'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/features/editable-table/helpers'

import { DetailsView } from '@/common/views'

const PokazatUslugiDetailsPage = () => {
  const { toast } = useToast()

  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useMainSchet((state) => state.main_schet?.id)

  const form = useForm({
    resolver: zodResolver(PokazatUslugiFormSchema),
    defaultValues: defaultValues
  })

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value) => {
        form.setValue('shartnomalar_organization_id', 0)
        form.setValue('id_spravochnik_organization', value)
        form.trigger('id_spravochnik_organization')
      }
    })
  )

  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: form.watch('spravochnik_operatsii_own_id'),
      onChange: (value) => {
        form.setValue('spravochnik_operatsii_own_id', value)
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
        organization: form.watch('id_spravochnik_organization'),
        pudratchi_bool: false
      }
    })
  )

  const { data: pokazatUslugi, isFetching } = useQuery({
    queryKey: [queryKeys.getById, Number(id), { main_schet_id }],
    queryFn: pokazatUslugiService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: pokazatUslugiService.create,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate('/organization/pokazat-uslugi')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update, id],
    mutationFn: pokazatUslugiService.update,
    onSuccess() {
      toast({ title: 'Документ успешно обновлен' })

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })

      navigate('/organization/pokazat-uslugi')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const onSubmit = form.handleSubmit((payload: PokazatUslugiForm) => {
    const {
      doc_date,
      doc_num,
      id_spravochnik_organization,
      spravochnik_operatsii_own_id,
      shartnomalar_organization_id,
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
        id_spravochnik_organization,
        opisanie,
        summa,
        childs: podvodki.map(normalizeEmptyFields<PokazatUslugiProvodkaForm>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      spravochnik_operatsii_own_id,
      shartnomalar_organization_id,
      id_spravochnik_organization,
      opisanie,
      summa,
      childs: podvodki.map(normalizeEmptyFields<PokazatUslugiProvodkaForm>)
    })
  })

  const podvodki = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: PokazatUslugiProvodkaForm[]) => {
      form.setValue('childs', payload)
    },
    [form]
  )

  useLayout({
    title: id ? 'Создать услуги' : 'Редактировать услуги',
    onBack() {
      navigate(-1)
    }
  })

  useEffect(() => {
    const summa =
      podvodki
        .filter((podvodka) => !isNaN(podvodka.kol) && !isNaN(podvodka.sena))
        .reduce((acc, curr) => acc + curr.kol * curr.sena, 0) ?? 0
    form.setValue('summa', summa)
  }, [form, podvodki])

  useEffect(() => {
    if (id === 'create') {
      form.reset(defaultValues)
      setPodvodki(defaultValues.childs)
      return
    }

    form.reset(pokazatUslugi?.data ?? defaultValues)
    setPodvodki(pokazatUslugi?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, pokazatUslugi, id])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isCreating || isUpdating}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">
              <DocumentFields
                tabIndex={1}
                form={form}
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
                error={form.formState.errors.id_spravochnik_organization}
                name="Покупатель"
                className="bg-slate-50"
              />
              <div className="h-full flex flex-col divide-y divide-border">
                <ShartnomaFields
                  tabIndex={4}
                  disabled={!form.watch('id_spravochnik_organization')}
                  spravochnik={shartnomaSpravochnik}
                  error={form.formState.errors.shartnomalar_organization_id}
                />
                <SummaFields data={{ summa: form.watch('summa') }} />
              </div>
            </div>

            <div className="mt-5 p-5">
              <OpisanieFields
                tabIndex={5}
                form={form}
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
          name="Подводка"
          className="flex-1 mt-10 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={6}
            columns={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: PokazatUslugiProvodkaFormSchema,
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

export default PokazatUslugiDetailsPage
