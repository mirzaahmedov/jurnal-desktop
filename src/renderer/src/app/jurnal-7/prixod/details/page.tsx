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
import { Operatsii, TypeSchetOperatsii } from '@renderer/common/models'
import { PrixodFormSchema, defaultValues, queryKeys } from '../config'
import { parseDate, withinMonth } from '@renderer/common/lib/date'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePrixodCreate, usePrixodGet, usePrixodUpdate } from '../service'

import { DetailsView } from '@renderer/common/views'
import { Form } from '@renderer/common/components/ui/form'
import { ProvodkaTable } from './provodka-table'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { createResponsibleSpravochnik } from '../../responsible/service'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useJurnal7DefaultsStore } from '../../common/features/defaults'
import { useLayout } from '@renderer/common/features/layout'
import { useQueryClient } from '@tanstack/react-query'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

const MO7PrixodDetailsPage = () => {
  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const { id } = useParams()

  const { from } = useJurnal7DefaultsStore()
  const { data: prixod, isFetching } = usePrixodGet(Number(id))
  const { mutate: createPrixod, isPending: isCreating } = usePrixodCreate({
    onSuccess: () => {
      toast.success('Приход успешно создан')
      navigate(-1)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    },
    onError(error) {
      console.log(error)
      toast.error('Ошибка при создании прихода: ' + error.message)
    }
  })
  const { mutate: updatePrixod, isPending: isUpdating } = usePrixodUpdate({
    onSuccess() {
      toast.success('Приход успешно обновлен')
      navigate(-1)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    },
    onError(error) {
      console.log(error)
      toast.error('Ошибка при обновлении прихода: ' + error.message)
    }
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(PrixodFormSchema)
  })
  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('kimdan_id'),
      onChange: (value) => {
        form.setValue('kimdan_id', value)
        form.trigger('kimdan_id')
      }
    })
  )
  const responsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('kimga_id'),
      onChange: (value) => {
        form.setValue('kimga_id', value)
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
        organization: form.watch('kimdan_id')
      }
    })
  )
  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      onChange: (_, operatsii) => {
        form.setValue('j_o_num', operatsii?.schet ?? '')
        form.setValue(
          'childs',
          form.getValues('childs').map((child) => ({
            ...child,
            kredit_schet: operatsii?.schet ?? ''
          }))
        )
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
        data_pereotsenka: child.data_pereotsenka ? child.data_pereotsenka : doc_date
      }))
    )
  }, [form, doc_date])
  useEffect(() => {
    if (id !== 'create') {
      return
    }

    const defaultDate = parseDate(from)
    const docDate = parseDate(form.watch('doc_date'))

    if (!docDate || !withinMonth(docDate, defaultDate)) {
      form.setValue('doc_date', from)
    }
  }, [id, from, form])

  useLayout({
    title: id === 'create' ? 'Создать приход' : 'Редактировать приход',
    onBack() {
      navigate(-1)
    }
  })

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
                form={form}
                validateDocDate={(date) => {
                  return withinMonth(new Date(date), parseDate(from))
                }}
                calendarProps={{
                  fromMonth: parseDate(from),
                  toMonth: parseDate(from)
                }}
              />
              <div className="flex items-center gap-5 flex-wrap pb-7 px-5">
                <JONumFields
                  spravochnik={{
                    ...operatsiiSpravochnik,
                    selected: {
                      schet: form.watch('j_o_num')
                    } as Operatsii
                  }}
                />
                <DoverennostFields form={form} />
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x">
              <OrganizationFields
                name="От кого"
                spravochnik={orgSpravochnik}
                error={form.formState.errors.kimdan_id}
              />
              <ResponsibleFields
                name="Кому"
                spravochnik={responsibleSpravochnik}
                error={form.formState.errors.kimga_id}
              />
            </div>
            <div className="grid grid-cols-2">
              <ShartnomaFields
                disabled={!form.watch('kimdan_id')}
                spravochnik={shartnomaSpravochnik}
                error={form.formState.errors.id_shartnomalar_organization}
              />
              <SummaFields
                data={{
                  summa
                }}
              />
            </div>
            <div className="p-5">
              <OpisanieFields form={form} />
            </div>
            <DetailsView.Footer>
              <DetailsView.Create disabled={isCreating || isUpdating} />
            </DetailsView.Footer>
          </form>
        </Form>

        <div className="p-5 mb-28 w-full overflow-x-auto scrollbar">
          <ProvodkaTable form={form} />
        </div>
      </DetailsView.Content>
    </DetailsView>
  )
}

export { MO7PrixodDetailsPage }
