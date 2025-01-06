import type { RasxodPayloadType, RasxodPodvodkaPayloadType } from '../service'

import { RasxodPayloadSchema, RasxodPodvodkaPayloadSchema, bankRasxodService } from '../service'
import { useCallback, useEffect } from 'react'
import { useSpravochnik } from '@/common/features/spravochnik'
import { Form } from '@/common/components/ui/form'
import { Fieldset, AccountBalance } from '@/common/components'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { useToast } from '@/common/hooks/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { defaultValues, queryKeys } from '../constants'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { useLayout } from '@/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { EditableTable } from '@/common/features/editable-table'
import { podvodkaColumns } from './podvodki'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/features/editable-table/helpers'
import {
  ShartnomaFields,
  DocumentFields,
  ManagementFields,
  OpisanieFields,
  OrganizationFields,
  SummaFields,
  MainSchetFields
} from '@/common/widget/form'
import { formatDate } from '@/common/lib/date'
import { bankMonitorService, bankMonitorQueryKeys } from '../../monitor'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useDefaultFormFields } from '@/common/features/app-defaults'
import { extendObject } from '@/common/lib/utils'
import { formatLocaleDate } from '@/common/lib/format'

import { DetailsView } from '@/common/views'
import { GeneratePorucheniya } from './generate-porucheniya'

const BankRasxodDetailtsPage = () => {
  const { toast } = useToast()
  const { id } = useParams()

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)

  const { rukovoditel: default_rukovoditel, glav_buxgalter: default_glav_buxgalter } =
    useDefaultFormFields()

  const form = useForm<RasxodPayloadType>({
    resolver: zodResolver(RasxodPayloadSchema),
    defaultValues: extendObject(defaultValues, {
      rukovoditel: default_rukovoditel,
      glav_buxgalter: default_glav_buxgalter
    })
  })

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('id_spravochnik_organization'),
      onChange: (value) => {
        form.setValue('id_spravochnik_organization', value)
        form.setValue('id_shartnomalar_organization', 0)
        form.trigger('id_spravochnik_organization')
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
        organization: form.watch('id_spravochnik_organization')
      }
    })
  )

  const { data: main_schet } = useQuery({
    queryKey: [mainSchetQueryKeys.getAll, main_schet_id],
    queryFn: mainSchetService.getById
  })

  const { data: monitor, isFetching: isFetchingMonitor } = useQuery({
    queryKey: [
      bankMonitorQueryKeys.getAll,
      {
        main_schet_id,
        limit: 1,
        page: 1,
        from: formatDate(new Date()),
        to: formatDate(new Date())
      }
    ],
    queryFn: bankMonitorService.getAll
  })

  const { data: rasxod, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: bankRasxodService.getById,
    enabled: id !== 'create'
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: bankRasxodService.create,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      form.reset(defaultValues)
      navigate('/bank/rasxod')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: bankRasxodService.update,
    onSuccess() {
      toast({ title: 'Документ успешно создан' })
      navigate('/bank/rasxod')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getById, id]
      })
    },
    onError(error) {
      toast({ title: error.message, variant: 'destructive' })
    }
  })

  const onSubmit = form.handleSubmit((payload: RasxodPayloadType) => {
    const {
      doc_date,
      doc_num,
      id_spravochnik_organization,
      opisanie,
      rukovoditel,
      glav_buxgalter,
      id_shartnomalar_organization,
      summa
    } = payload

    if (id !== 'create') {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        id_spravochnik_organization,
        id_shartnomalar_organization,
        summa,
        opisanie,
        rukovoditel,
        glav_buxgalter,
        childs: podvodki.map(normalizeEmptyFields<RasxodPodvodkaPayloadType>)
      })
      return
    }
    create({
      doc_date,
      doc_num,
      id_spravochnik_organization,
      id_shartnomalar_organization,
      summa,
      opisanie,
      rukovoditel,
      glav_buxgalter,
      childs: podvodki.map(normalizeEmptyFields<RasxodPodvodkaPayloadType>)
    })
  })

  const podvodki = form.watch('childs')
  const setPodvodki = useCallback(
    (payload: RasxodPodvodkaPayloadType[]) => {
      form.setValue('childs', payload)
    },
    [form]
  )

  const summa = form.watch('summa')
  const reminder = (monitor?.meta?.summa_to ?? 0) - (summa ?? 0) + (rasxod?.data?.summa ?? 0)

  useLayout({
    title: id === 'create' ? 'Создать расходный документ' : 'Редактировать расходный документ',
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

    form.reset(rasxod?.data ?? defaultValues)
    setPodvodki(rasxod?.data?.childs ?? defaultValues.childs)
  }, [setPodvodki, form, rasxod, id])

  const { doc_num, doc_date } = form.watch()
  useEffect(() => {
    if (form.getValues('opisanie') || !doc_num || !doc_date) {
      return
    }
    form.setValue(
      'opisanie',
      `№ ${doc_num}-сонли ${formatLocaleDate(doc_date)} йил кунги шартномага асосан  Ст: (субсчет)`
    )
  }, [form, doc_date, doc_num])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isCreating || isUpdating}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="flex">
                <DocumentFields
                  tabIndex={1}
                  form={form}
                />
              </div>

              <div className="grid grid-cols-2 items-start border-y divide-x divide-border/50 border-border/50">
                <MainSchetFields main_schet={main_schet?.data} />
                <OrganizationFields
                  gazna
                  tabIndex={2}
                  error={form.formState.errors.id_spravochnik_organization}
                  spravochnik={orgSpravochnik}
                  className="bg-slate-50"
                  name="Данные получателя"
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <SummaFields data={{ summa: form.watch('summa') }} />
                <ShartnomaFields
                  tabIndex={3}
                  disabled={!form.watch('id_spravochnik_organization')}
                  spravochnik={shartnomaSpravochnik}
                  error={form.formState.errors.id_shartnomalar_organization}
                />
              </div>

              <div className="-mt-5 p-5">
                <OpisanieFields
                  tabIndex={4}
                  form={form}
                />
              </div>
              <div className="grid grid-cols-3">
                <ManagementFields
                  tabIndex={5}
                  form={form}
                  className="pt-0 col-span-2"
                />
              </div>
            </div>

            <DetailsView.Footer className="flex flex-row gap-10">
              <DetailsView.Create
                disabled={
                  !monitor?.meta?.summa_to ||
                  monitor?.meta?.summa_to < 0 ||
                  !summa ||
                  reminder < 0 ||
                  isFetchingMonitor ||
                  isFetching ||
                  isUpdating ||
                  isCreating
                }
                tabIndex={7}
              />
              {summa ? <AccountBalance balance={reminder} /> : null}

              {main_schet?.data && orgSpravochnik.selected && form.formState.isValid ? (
                <ButtonGroup borderStyle="dashed">
                  <GeneratePorucheniya
                    type="porucheniya"
                    tabIndex={8}
                    fileName={`поручения-${form.watch('doc_num')}.xlsx`}
                    buttonText="Создать Поручения"
                    data={{
                      rasxod: form.getValues(),
                      main_schet: main_schet.data,
                      organization: orgSpravochnik.selected
                    }}
                  />
                  <GeneratePorucheniya
                    type="porucheniya_nalog"
                    tabIndex={8}
                    fileName={`поручения-${form.watch('doc_num')}_налог.xlsx`}
                    buttonText="Создать Поручения (Налог)"
                    data={{
                      rasxod: form.getValues(),
                      main_schet: main_schet.data,
                      organization: orgSpravochnik.selected
                    }}
                  />
                </ButtonGroup>
              ) : null}
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name="Подводка"
          className="flex-1 mt-5 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={6}
            columns={podvodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: RasxodPodvodkaPayloadSchema,
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

export default BankRasxodDetailtsPage
