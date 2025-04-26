import { useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { EditableTable } from '@/common/components/editable-table'
import { FormElement } from '@/common/components/form'
import { Form, FormField } from '@/common/components/ui/form'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { DetailsView } from '@/common/views'

import { SmetaGrafikFormSchema, SmetaGrafikQueryKeys, defaultValues } from '../config'
import { SmetaGrafikService } from '../service'
import { provodki } from './provodki'

export interface SmetaGrafikDetailsProps {
  id: number
}
export const SmetaGrafikDetails = ({ id }: SmetaGrafikDetailsProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const tableRef = useRef<HTMLTableElement>(null)

  const form = useForm({
    resolver: zodResolver(SmetaGrafikFormSchema),
    defaultValues: defaultValues
  })

  const { t } = useTranslation()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const { data: smetaGrafik, isFetching } = useQuery({
    queryKey: [
      SmetaGrafikQueryKeys.getById,
      Number(id),
      {
        main_schet_id
      }
    ],
    queryFn: SmetaGrafikService.getById
  })

  const { mutate: updateGrafik, isPending } = useMutation({
    mutationKey: [SmetaGrafikQueryKeys.update],
    mutationFn: SmetaGrafikService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [SmetaGrafikQueryKeys.getAll]
      })
      navigate(-1)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!budjet_id || !main_schet_id) {
      toast.error('Выберите бюджет и главный счет')
      return
    }
    updateGrafik({
      ...values.smetas[0],
      year: values.year,
      id: Number(id),
      spravochnik_budjet_name_id: budjet_id,
      main_schet_id
    })
  })

  useEffect(() => {
    if (smetaGrafik?.data) {
      form.reset({
        year: smetaGrafik.data.year,
        smetas: [smetaGrafik.data]
      })
      return
    }
    form.reset(defaultValues)
  }, [form, smetaGrafik])

  const smetas = useWatch({
    control: form.control,
    name: 'smetas'
  })

  useEffect(() => {
    const totals = smetas.map((smeta) => {
      return (
        smeta.oy_1 +
        smeta.oy_2 +
        smeta.oy_3 +
        smeta.oy_4 +
        smeta.oy_5 +
        smeta.oy_6 +
        smeta.oy_7 +
        smeta.oy_8 +
        smeta.oy_9 +
        smeta.oy_10 +
        smeta.oy_11 +
        smeta.oy_12
      )
    })

    totals.forEach((total, index) => {
      if (form.getValues(`smetas.${index}.total`) !== total) {
        form.setValue(`smetas.${index}.total`, total)
        if (total !== 0) {
          const fields = Array.from({ length: 12 }, (_, i) => `smetas.${index}.oy_${i + 1}`)
          form.trigger(fields as any)
        }
      }
    })
  }, [smetas, form])

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isPending}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="p-5 flex items-center">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormElement
                    label={t('year')}
                    direction="column"
                  >
                    <YearSelect
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      className="w-24"
                    />
                  </FormElement>
                )}
              />
            </div>
            <EditableTable
              tableRef={tableRef}
              tabIndex={5}
              columnDefs={provodki}
              form={form}
              name="smetas"
              errors={form.formState.errors.smetas}
            />
            <DetailsView.Footer>
              <DetailsView.Create
                isPending={isPending}
                type="submit"
              >
                {t('create')}
              </DetailsView.Create>
            </DetailsView.Footer>
          </form>
        </Form>
      </DetailsView.Content>
    </DetailsView>
  )
}
