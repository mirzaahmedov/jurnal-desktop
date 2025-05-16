import type { Shartnoma } from '@/common/models'

import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { Button } from '@/common/components/ui/button'
import { Form } from '@/common/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { DocumentType } from '@/common/features/doc-num'
import { useSnippets } from '@/common/features/snippents/use-snippets'
import { useSpravochnik } from '@/common/features/spravochnik'
import { parseDate } from '@/common/lib/date'
import { cn } from '@/common/lib/utils'
import {
  DocumentFields,
  OpisanieFields,
  OrganizationFields,
  SummaFields
} from '@/common/widget/form'

import { ShartnomaQueryKeys, defaultValues } from '../config'
import { ContractService, ShartnomaFormSchema } from '../service'
import { PudratchiFields } from './pudratchi'
import { ShartnomaGrafikForm } from './shartnoma-grafik-form'

enum TabOption {
  DETAILS = 'DETAILS',
  GRAFIK = 'GRAFIK'
}

interface ShartnomaFormProps {
  loading?: boolean
  dialog?: boolean
  organId?: number
  original?: Shartnoma
  selected?: Shartnoma | undefined
  onSuccess?: () => void
}
export const ShartnomaForm = ({
  loading = false,
  dialog = true,
  organId,
  original,
  selected,
  onSuccess
}: ShartnomaFormProps) => {
  const queryClient = useQueryClient()
  const id = selected?.id

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.DETAILS)

  const { t } = useTranslation()
  const { snippets, addSnippet, removeSnippet } = useSnippets({
    ns: 'shartnoma'
  })

  const form = useForm({
    resolver: zodResolver(ShartnomaFormSchema),
    defaultValues: {
      ...defaultValues,
      ...original,
      grafiks: defaultValues.grafiks
    }
  })

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: form.watch('spravochnik_organization_id'),
      onChange: (id) => {
        form.setValue('spravochnik_organization_id', id ?? 0, { shouldValidate: true })
      }
    })
  )

  const { mutate: createContract, isPending: isCreating } = useMutation({
    mutationKey: [ShartnomaQueryKeys.create],
    mutationFn: ContractService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [ShartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [ShartnomaQueryKeys.getById, id]
      })

      onSuccess?.()
    }
  })

  const { mutate: updateContract, isPending: isUpdating } = useMutation({
    mutationKey: [ShartnomaQueryKeys.update, id],
    mutationFn: ContractService.update,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [ShartnomaQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [ShartnomaQueryKeys.getById, id]
      })

      onSuccess?.()
    }
  })

  const onSubmit = form.handleSubmit(
    ({
      doc_date,
      doc_num,
      spravochnik_organization_id,
      opisanie,
      pudratchi_bool,
      grafik_year,
      grafiks
    }) => {
      if (selected) {
        updateContract({
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

      createContract({
        doc_date,
        doc_num,
        spravochnik_organization_id,
        opisanie,
        pudratchi_bool,
        grafik_year: parseDate(doc_date).getFullYear(),
        grafiks
      })
    }
  )

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

  const errors = form.formState.errors
  useEffect(() => {
    if (errors?.grafiks) {
      setTabValue(TabOption.GRAFIK)
    } else {
      setTabValue(TabOption.DETAILS)
    }
  }, [errors])
  useEffect(() => {
    if (organId) {
      form.setValue('spravochnik_organization_id', organId, { shouldValidate: true })
    }
  }, [organId])

  const grafiks = useWatch({
    control: form.control,
    name: 'grafiks'
  })
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

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Tabs
          value={tabValue}
          onValueChange={(value) => setTabValue(value as TabOption)}
          className="divide-y"
        >
          <div className={cn('p-5', dialog && 'px-0')}>
            <TabsList>
              <TabsTrigger value={TabOption.DETAILS}>{t('details')}</TabsTrigger>
              <TabsTrigger value={TabOption.GRAFIK}>{t('grafik')}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={TabOption.DETAILS}>
            <div className="divide-y">
              <div className={cn('grid grid-cols-2 gap-10 divide-x', dialog && 'grid-cols-1')}>
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

                  <div>
                    <SummaFields
                      dialog={dialog}
                      data={{
                        summa: itogo
                      }}
                    />
                  </div>
                </div>
                <div>
                  <OrganizationFields spravochnik={organSpravochnik} />
                </div>
              </div>

              <div className={cn('p-5', dialog && 'p-0 pt-5')}>
                <OpisanieFields
                  tabIndex={2}
                  form={form}
                  snippets={snippets}
                  addSnippet={addSnippet}
                  removeSnippet={removeSnippet}
                />
              </div>

              <div className={cn('grid grid-cols-2 gap-10 border-b-0', dialog && 'gap-20')}>
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
              isPending={isCreating || isUpdating || loading}
            >
              {t('save')}
            </Button>
          </div>
        </Tabs>
      </form>
    </Form>
  )
}
