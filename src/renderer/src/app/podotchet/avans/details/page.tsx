import type { AdvanceReportPodvodkaPayloadType } from '../constants'

import {
  AdvanceReportPayloadSchema,
  AdvanceReportPodvodkaPayloadSchema,
  avansQueryKeys,
  defaultValues
} from '../constants'
import { avansService } from '../service'
import { useCallback, useEffect } from 'react'
import { useSpravochnik } from '@/common/features/spravochnik'
import { Form } from '@/common/components/ui/form'
import { Fieldset } from '@/common/components'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { TypeSchetOperatsii } from '@/common/models'
import { useToast } from '@/common/hooks/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { EditableTable } from '@/common/features/editable-table'
import { podvodkaColumns } from './podvodki'
import {
  DocumentFields,
  OpisanieFields,
  SummaFields,
  PodotchetFields,
  OperatsiiFields
} from '@/common/widget/form'
import { DetailsPageContainer, DetailsPageCreateBtn, DetailsPageFooter } from '@/common/layout'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/features/editable-table/helpers'

const AdvanceReportDetailsPage = () => {
  const { toast } = useToast()

  const main_schet_id = useMainSchet((state) => state.main_schet?.id)
  const id = useParams().id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(AdvanceReportPayloadSchema),
    defaultValues: defaultValues
  })

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

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: form.watch('spravochnik_podotchet_litso_id'),
      onChange: (value) => {
        form.setValue('spravochnik_podotchet_litso_id', value)
        form.trigger('spravochnik_podotchet_litso_id')
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
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getById, id]
      })

      navigate('/accountable/advance-report')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [avansQueryKeys.update, id],
    mutationFn: avansService.update,
    onSuccess() {
      toast({ title: 'Документ успешно обновлен' })

      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getById, id]
      })

      navigate('/accountable/advance-report')
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    const {
      doc_date,
      doc_num,
      spravochnik_operatsii_own_id,
      spravochnik_podotchet_litso_id,
      opisanie
    } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        spravochnik_operatsii_own_id,
        spravochnik_podotchet_litso_id,
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
      opisanie,
      childs: podvodki.map(normalizeEmptyFields<AdvanceReportPodvodkaPayloadType>)
    })
  })

  const podvodki = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: AdvanceReportPodvodkaPayloadType[]) => {
      form.setValue('childs', payload)
    },
    [form]
  )

  useLayout({
    title: id === 'create' ? 'Создать авансовые отчёты' : 'Редактировать авансовые отчёты',
    onBack() {
      navigate(-1)
    }
  })

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
      setPodvodki(defaultValues.childs)
      return
    }

    form.reset(prixod?.data ?? defaultValues)
    setPodvodki(prixod?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, prixod, id])

  return (
    <DetailsPageContainer loading={isFetching}>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div>
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
              <div className="h-full bg-slate-50">
                <PodotchetFields
                  tabIndex={3}
                  spravochnik={podotchetSpravochnik}
                  error={form.formState.errors.spravochnik_podotchet_litso_id}
                />
              </div>
              <SummaFields data={{ summa: form.watch('summa') }} />
            </div>

            <div className="p-5">
              <OpisanieFields
                tabIndex={4}
                form={form}
              />
            </div>
          </div>

          <DetailsPageFooter>
            <DetailsPageCreateBtn
              tabIndex={6}
              disabled={isCreating || isUpdating}
            />
          </DetailsPageFooter>
        </form>
      </Form>
      <Fieldset
        name="Подводка"
        className="flex-1 mt-10 pb-24 bg-slate-50"
      >
        <EditableTable
          tabIndex={5}
          columns={podvodkaColumns}
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
    </DetailsPageContainer>
  )
}

export default AdvanceReportDetailsPage
