import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TabelColumnDefs } from '@/app/jur_5/nachislenie/tabel/columns'
import { TabelService } from '@/app/jur_5/nachislenie/tabel/service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthSelect } from '@/common/components/month-select'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { YearSelect } from '@/common/components/year-select'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, type VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import { parseDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { defaultValues } from '../config'
import { NachislenieService } from '../service'

const ChooseTabelColumnDefs = [
  ...TabelColumnDefs,
  {
    key: 'rayon',
    minWidth: 200
  } satisfies (typeof TabelColumnDefs)[0]
]

export interface NachislenieCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  vacant: VacantTreeNode | undefined
  mainSchetId: number
  spravochnikBudjetNameId: number
}
export const NachislenieCreateDialog = ({
  vacant,
  mainSchetId,
  spravochnikBudjetNameId,
  ...props
}: NachislenieCreateDialogProps) => {
  const { t } = useTranslation(['app'])
  const { treeNodes, vacantsQuery } = useVacantTreeNodes()

  const [search, setSearch] = useState<string>('')
  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)

  const queryClient = useQueryClient()

  const { mutate: getMaxDocNum } = useMutation({
    mutationFn: NachislenieService.getMaxDocNum,
    onSuccess: (docNum) => {
      form.setValue('docNum', docNum)
    }
  })
  const { data: tabels, isFetching } = useQuery({
    queryKey: [
      TabelService.QueryKeys.GetAll,
      {
        page: 1,
        limit: 10,
        budjetId: spravochnikBudjetNameId,
        vacantId: selectedVacant?.id ?? 0,
        docNum: search ? search : undefined,
        status: false
      }
    ],
    queryFn: TabelService.getAll,
    enabled: props?.isOpen
  })
  const { mutate: createNachislenie, isPending } = useMutation({
    mutationFn: NachislenieService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetByVacantId]
      })
      props?.onOpenChange?.(false)
    },
    onError: (res) => {
      toast.error(res?.message ?? t('create_failed'))
    }
  })

  const form = useForm({
    defaultValues
  })

  const handleSubmit = form.handleSubmit((values) => {
    createNachislenie({
      ...values,
      docDate: formatLocaleDate(values.docDate),
      mainSchetId,
      spravochnikBudjetNameId
    })
  })

  useEffect(() => {
    setSelectedVacant(vacant ?? null)
  }, [vacant])

  useEffect(() => {
    getMaxDocNum()
  }, [getMaxDocNum])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl h-full max-h-[700px] p-0">
          <div className="overflow-hidden h-full flex flex-col">
            <DialogHeader className="p-5">
              <DialogTitle>{t('nachislenie')}</DialogTitle>
            </DialogHeader>
            <Allotment className="flex-1 min-h-0">
              <Allotment.Pane
                preferredSize={300}
                maxSize={600}
                minSize={200}
                className="w-full bg-gray-50"
              >
                <div className="h-full overflow-y-auto scrollbar">
                  {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
                  <VacantTree
                    nodes={treeNodes}
                    selectedIds={selectedVacant ? [selectedVacant?.id] : []}
                    onSelectNode={setSelectedVacant}
                  />
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <Form {...form}>
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="pl-5 h-full flex flex-col gap-2.5"
                  >
                    <div className="flex flex-wrap gap-5">
                      <FormField
                        control={form.control}
                        name="docNum"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('doc_num')}
                          >
                            <Input
                              type="number"
                              {...field}
                            />
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="docDate"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('doc_date')}
                          >
                            <JollyDatePicker
                              {...field}
                              onChange={(value) => {
                                field.onChange(value)
                                if (value) {
                                  const date = parseDate(value)
                                  form.setValue('nachislenieYear', date.getFullYear())
                                  form.setValue('nachislenieMonth', date.getMonth() + 1)
                                }
                              }}
                            />
                          </FormElement>
                        )}
                      />

                      <div className="flex items-center gap-5">
                        <FormField
                          control={form.control}
                          name="nachislenieYear"
                          render={({ field }) => (
                            <FormElement
                              direction="column"
                              label={t('year')}
                            >
                              <YearSelect
                                isReadOnly
                                selectedKey={field.value}
                                onSelectionChange={field.onChange}
                              />
                            </FormElement>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="nachislenieMonth"
                          render={({ field }) => (
                            <FormElement
                              direction="column"
                              label={t('month')}
                            >
                              <MonthSelect
                                isReadOnly
                                selectedKey={field.value}
                                onSelectionChange={field.onChange}
                                className="w-32"
                              />
                            </FormElement>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-h-0 rounded-lg border p-2.5 flex flex-col gap-2.5">
                      <div>
                        <SearchInputDebounced
                          value={search}
                          onValueChange={setSearch}
                        />
                      </div>
                      <div className="flex-1 overflow-y-auto scrollbar">
                        {isFetching ? <LoadingOverlay /> : null}
                        <GenericTable
                          columnDefs={ChooseTabelColumnDefs}
                          data={tabels ?? []}
                          selectedIds={form.watch('tabelMainId') ? [form.watch('tabelMainId')] : []}
                          onClickRow={(value) => form.setValue('tabelMainId', value.id)}
                          className="table-generic-xs"
                        />
                      </div>
                    </div>

                    <div className="p-5 text-end">
                      <Button
                        type="submit"
                        isPending={isPending}
                      >
                        {t('save')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </Allotment.Pane>
            </Allotment>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
