import type { Shartnoma } from '@renderer/common/models'

import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/common/components/ui/button'
import { Form } from '@renderer/common/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/common/components/ui/tabs'
import { DocumentType } from '@renderer/common/features/doc-num'
import { parseDate } from '@renderer/common/lib/date'
import { cn } from '@renderer/common/lib/utils'
import { DocumentFields, OpisanieFields, SummaFields } from '@renderer/common/widget/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { defaultValues, shartnomaQueryKeys } from '../config'
import { ShartnomaFormSchema, shartnomaService } from '../service'
import { PudratchiFields } from './pudratchi'
import { ShartnomaGrafikForm } from './shartnoma-grafik-form'

enum TabOption {
  DETAILS = 'DETAILS',
  GRAFIK = 'GRAFIK'
}

type ShartnomaFormProps = {
  loading?: boolean
  dialog?: boolean
  organization: number
  original?: Shartnoma
  selected?: Shartnoma | undefined
  onSuccess?: () => void
}
export const ShartnomaForm = ({
  loading = false,
  dialog = true,
  organization,
  original,
  selected,
  onSuccess
}: ShartnomaFormProps) => {
  const queryClient = useQueryClient()
  const id = selected?.id

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.DETAILS)

  const { t } = useTranslation()

  const form = useForm({
    resolver: zodResolver(ShartnomaFormSchema),
    defaultValues: {
      ...defaultValues,
      ...original,
      grafiks: defaultValues.grafiks
    }
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [shartnomaQueryKeys.create],
    mutationFn: shartnomaService.create,
    onSuccess() {
      toast.success('Документ успешно создан')
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getById, id]
      })

      onSuccess?.()
    },
    onError(error) {
      console.error(error)
      toast.error('Не удалось создать документ:' + error.message)
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [shartnomaQueryKeys.update, id],
    mutationFn: shartnomaService.update,
    onSuccess() {
      toast.success('Документ успешно обновлен')

      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getById, id]
      })

      onSuccess?.()
    },
    onError(error) {
      console.error(error)
      toast.error('Не удалось обновить документ:' + error.message)
    }
  })

  const onSubmit = form.handleSubmit((payload) => {
    const {
      doc_date,
      doc_num,
      spravochnik_organization_id,
      opisanie,
      pudratchi_bool,
      grafik_year,
      grafiks
    } = payload

    if (selected) {
      update({
        id: Number(id),
        doc_date,
        doc_num,
        spravochnik_organization_id,
        opisanie,
        pudratchi_bool,
        grafik_year,
        grafiks
      })
      return
    }

    create({
      doc_date,
      doc_num,
      spravochnik_organization_id,
      opisanie,
      pudratchi_bool,
      grafik_year: parseDate(doc_date).getFullYear(),
      grafiks
    })
  })

  useEffect(() => {
    if (!selected) {
      if (original) {
        form.reset({
          ...original,
          grafiks: defaultValues.grafiks
        })
      } else {
        form.reset(defaultValues)
      }
      return
    }
    form.reset(selected)
  }, [form, original, selected, id])

  useEffect(() => {
    if (organization) {
      form.setValue('spravochnik_organization_id', organization)
    } else {
      form.setValue('spravochnik_organization_id', 0)
    }
  }, [form, organization])

  const errors = form.formState.errors
  useEffect(() => {
    if (errors?.grafiks) {
      setTabValue(TabOption.GRAFIK)
    } else {
      setTabValue(TabOption.DETAILS)
    }
  }, [errors])

  const grafiks = form.watch('grafiks')
  const itogo = useMemo(() => {
    return grafiks?.reduce(
      (result, grafik) =>
        result +
        ((grafik?.oy_1 ?? 0) +
          (grafik?.oy_2 ?? 0) +
          (grafik?.oy_3 ?? 0) +
          (grafik?.oy_4 ?? 0) +
          (grafik?.oy_5 ?? 0) +
          (grafik?.oy_6 ?? 0) +
          (grafik?.oy_7 ?? 0) +
          (grafik?.oy_8 ?? 0) +
          (grafik?.oy_9 ?? 0) +
          (grafik?.oy_10 ?? 0) +
          (grafik?.oy_11 ?? 0) +
          (grafik?.oy_12 ?? 0)),
      0
    )
  }, [grafiks])

  console.log({ errors: form.formState.errors })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Tabs
          value={tabValue}
          onValueChange={(value) => setTabValue(value as TabOption)}
        >
          <div className={cn('p-5', dialog && 'px-0')}>
            <TabsList>
              <TabsTrigger value={TabOption.DETAILS}>{t('details')}</TabsTrigger>
              <TabsTrigger value={TabOption.GRAFIK}>{t('grafik')}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={TabOption.DETAILS}>
            <div>
              <div className="flex">
                <DocumentFields
                  tabIndex={1}
                  dialog={dialog}
                  form={form}
                  documentType={DocumentType.CONTRACT}
                  autoGenerate={!selected}
                />
              </div>

              <div className={cn('grid grid-cols-2 gap-10', dialog && 'grid-cols-1 gap-1')}>
                <SummaFields
                  dialog={dialog}
                  data={{
                    summa: itogo
                  }}
                />
              </div>

              <div className={cn('p-5', dialog && 'p-0 pt-5')}>
                <OpisanieFields
                  tabIndex={2}
                  form={form}
                />
              </div>

              <div className={cn('grid grid-cols-2 gap-10', dialog && 'gap-20')}>
                <PudratchiFields
                  form={form}
                  tabIndex={3}
                  className={dialog ? 'p-0' : undefined}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value={TabOption.GRAFIK}
            className="w-full overflow-x-auto scrollbar"
          >
            <div className={cn('p-5 relative w-[2400px]', dialog && 'px-0')}>
              <ShartnomaGrafikForm
                form={form}
                itogo={itogo}
              />
            </div>
          </TabsContent>
          <div className={cn('p-5', dialog && 'p-0 pt-5')}>
            <Button
              type="submit"
              tabIndex={4}
              disabled={isCreating || isUpdating || loading}
            >
              {t('save')}
            </Button>
          </div>
        </Tabs>
      </form>
    </Form>
  )
}
