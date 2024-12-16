import { DetailsPage, DetailsPageCreateBtn, DetailsPageFooter } from '@/common/layout/details'
import {
  DocumentFields,
  DoverennostFields,
  JONumFields,
  OpisanieFields,
  OrganizationFields,
  ResponsibleFields,
  ShartnomaFields,
  SummaFields
} from '@/common/widget/form'
import { Operatsii, TypeSchetOperatsii } from '@/common/models'
import { PrixodFormSchema, defaultValues, queryKeys } from '../config'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePrixodCreate, usePrixodGet, usePrixodUpdate } from '../service'

import { Form } from '@/common/components/ui/form'
import { ProvodkaTable } from './provodka-table'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { createResponsibleSpravochnik } from '../../responsible/service'
import { createShartnomaSpravochnik } from '@renderer/app/organization/shartnoma'
import { toast } from '@/common/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { useLayout } from '@/common/features/layout'
import { useQueryClient } from '@tanstack/react-query'
import { useSpravochnik } from '@/common/features/spravochnik'
import { zodResolver } from '@hookform/resolvers/zod'

const MO7PrixodDetailsPage = () => {
  const prevData = useRef({
    kimdan_id: 0,
    kimga_id: 0
  })

  const { id } = useParams()

  const { data: prixod, isFetching } = usePrixodGet(Number(id))
  const { mutate: createPrixod, isPending: isCreating } = usePrixodCreate({
    onSuccess: () => {
      toast({
        title: 'Приход успешно создан'
      })
      navigate('/journal-7/prixod')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    },
    onError() {
      toast({
        title: 'Ошибка при создании прихода',
        variant: 'destructive'
      })
    }
  })
  const { mutate: updatePrixod, isPending: isUpdating } = usePrixodUpdate({
    onSuccess() {
      toast({
        title: 'Приход успешно обновлен'
      })
      navigate('/journal-7/prixod')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    },
    onError() {
      toast({
        title: 'Ошибка при обновлении прихода',
        variant: 'destructive'
      })
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
    form.reset(prixod?.data ? prixod.data : defaultValues)
  }, [form, prixod])

  const kimdan_id = form.watch('kimdan_id')
  useEffect(() => {
    if (kimdan_id !== prevData.current.kimdan_id) {
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

  useLayout({
    title: id === 'create' ? 'Создать приход' : 'Редактировать приход',
    onBack() {
      navigate(-1)
    }
  })

  return (
    <DetailsPage loading={isFetching}>
      <Form {...form}>
        <form onSubmit={onSubmit} className="divide-y">
          <div className="grid grid-cols-2 items-end">
            <DocumentFields form={form} />
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
          <DetailsPageFooter>
            <DetailsPageCreateBtn disabled={isCreating || isUpdating} />
          </DetailsPageFooter>
        </form>
      </Form>

      <div className="p-5 pb-28">
        <ProvodkaTable form={form} />
      </div>
    </DetailsPage>
  )
}

export { MO7PrixodDetailsPage }
