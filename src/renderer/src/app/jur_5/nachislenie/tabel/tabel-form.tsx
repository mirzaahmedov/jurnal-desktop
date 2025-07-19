import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay, Spinner } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { MonthSelect } from '@/common/components/month-select'
import { Badge } from '@/common/components/ui/badge'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { YearSelect } from '@/common/components/year-select'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { parseDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'
import { getVacantRayon } from '@/common/utils/zarplata'

import { MainZarplataColumnDefs } from '../columns'
import { TabelFormSchema, type TabelFormValues, defaultValues } from './config'
import { TabelService } from './service'

enum TabelFormTabs {
  SELECT = 'select',
  SELECTED = 'selected'
}

export interface TabelFormProps {
  budjetId: number
  mainSchetId: number
  vacants: VacantTreeNode[]
  vacantId: number | undefined
  isPending?: boolean
  onSubmit: (values: TabelFormValues) => void
}
export const TabelForm = ({
  budjetId,
  mainSchetId,
  vacants,
  vacantId,
  isPending,
  onSubmit
}: TabelFormProps) => {
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues,
    resolver: zodResolver(TabelFormSchema)
  })

  const [activeTab, setActiveTab] = useState<TabelFormTabs>(TabelFormTabs.SELECT)
  const [selectedMainZarplata, setSelectedMainZarplata] = useState<MainZarplata[]>([])
  const [visibleVacant, setVisibleVacant] = useState<number | null>(null)

  const { data: mainZarplata, isFetching: isFetchingMainZarplata } = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: vacantId ?? 0
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!vacantId
  })
  const { mutate: getMaxDocNum } = useMutation({
    mutationFn: TabelService.getMaxDocNum,
    onSuccess: (docNum) => {
      form.setValue('docNum', docNum)
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      docDate: formatLocaleDate(values.docDate),
      spravochnikBudjetNameId: budjetId,
      mainSchetId,
      tabelChildren: selectedMainZarplata.map((mainZarplata) => ({
        mainZarplataId: mainZarplata.id,
        rabDni: 0,
        otrabDni: 0,
        noch: 0,
        prazdnik: 0,
        pererabodka: 0,
        kazarma: 0
      }))
    })
  })

  useEffect(() => {
    getMaxDocNum()
  }, [getMaxDocNum])

  const selectedIds = useMemo(
    () => selectedMainZarplata.map((item) => item.id),
    [selectedMainZarplata]
  )
  const handleClickRow = useCallback((row: MainZarplata) => {
    setSelectedMainZarplata((prev) => {
      const prevCopied = [...prev]
      const existing = prevCopied.find((item) => item.id === row.id)
      if (existing) {
        return prevCopied.filter((item) => item.id !== row.id)
      } else {
        prevCopied.push(row)
        return prevCopied
      }
    })
  }, [])

  const selectedVacants = useMemo(() => {
    const vacantIds = new Map<number, number>()
    const vacantNodes: (VacantTreeNode & { _count: number })[] = []
    selectedMainZarplata.forEach((item) => {
      if (!vacantIds.has(item.vacantId)) {
        vacantIds.set(item.vacantId, 0)
      }
      vacantIds.set(item.vacantId, vacantIds.get(item.vacantId)! + 1)
    })
    const walk = (node: VacantTreeNode) => {
      if (vacantIds.has(node.id)) {
        vacantNodes.push({
          ...node,
          _count: vacantIds.get(node.id) ?? 0
        })
      }
      node.children.forEach(walk)
    }
    vacants.forEach((vacant) => {
      walk(vacant)
    })
    return vacantNodes
  }, [selectedMainZarplata, vacants])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="relative h-full flex flex-col overflow-hidden divide-y"
      >
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar p-5">
          <div className="flex flex-wrap gap-5">
            <FormField
              control={form.control}
              name="docNum"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('doc_num')}
                >
                  <div className="flex items-center gap-1">
                    <Input
                      readOnly
                      {...field}
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="size-10 flex-shrink-0"
                      variant="outline"
                      isDisabled={isPending}
                      onClick={() => {
                        getMaxDocNum()
                      }}
                    >
                      {isPending ? <Spinner className="size-5 border-2" /> : <RefreshCw />}
                    </Button>
                  </div>
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
                        form.setValue('tabelYear', date.getFullYear())
                        form.setValue('tabelMonth', date.getMonth() + 1)
                      }
                    }}
                  />
                </FormElement>
              )}
            />

            <div className="flex items-center gap-5">
              <FormField
                control={form.control}
                name="tabelYear"
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
                name="tabelMonth"
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

          <div className="flex items-center justify-between flex-wrap gap-5 py-2.5">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as TabelFormTabs)}
            >
              <TabsList>
                <TabsTrigger value={TabelFormTabs.SELECT}>{t('select')}</TabsTrigger>
                <TabsTrigger value={TabelFormTabs.SELECTED}>
                  {t('selected')}
                  {selectedMainZarplata.length ? (
                    <Badge className="-m-2 ml-2">{selectedMainZarplata.length}</Badge>
                  ) : null}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === TabelFormTabs.SELECT ? (
              <div className="relative w-full overflow-auto scrollbar pl-px">
                {isFetchingMainZarplata && <LoadingOverlay />}
                <GenericTable
                  data={mainZarplata ?? []}
                  columnDefs={MainZarplataColumnDefs}
                  selectedIds={selectedIds}
                  onClickRow={handleClickRow}
                  className="table-generic-xs"
                />
              </div>
            ) : null}
            {activeTab === TabelFormTabs.SELECTED ? (
              <>
                <div>
                  <ul className="flex items-center flex-wrap gap-5">
                    <li
                      className={cn(
                        'flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-700 cursor-pointer',
                        !visibleVacant && 'font-semibold hover:text-blue-500 text-blue-500'
                      )}
                      onClick={() => {
                        setVisibleVacant(null)
                      }}
                    >
                      <span className="text-xs">{t('all')}</span>
                      <span className="text-xs">({selectedMainZarplata.length})</span>
                    </li>
                    {selectedVacants.map((vacant) => (
                      <li
                        key={vacant.id}
                        className={cn(
                          'flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-700 cursor-pointer',
                          visibleVacant === vacant.id &&
                            'font-semibold hover:text-blue-500 text-blue-500'
                        )}
                        onClick={() => {
                          setVisibleVacant(vacant.id)
                        }}
                      >
                        <span className="text-xs">{getVacantRayon(vacant)}</span>
                        <span className="text-xs">({vacant._count})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative w-full overflow-auto scrollbar pl-px">
                  {isFetchingMainZarplata && <LoadingOverlay />}
                  <GenericTable
                    data={
                      visibleVacant
                        ? (selectedMainZarplata.filter(
                            (mainZarplata) => mainZarplata.vacantId === visibleVacant
                          ) ?? [])
                        : selectedMainZarplata
                    }
                    columnDefs={MainZarplataColumnDefs}
                    selectedIds={selectedIds}
                    onClickRow={handleClickRow}
                    className="table-generic-xs"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="px-5 pt-5">
          <Button
            type="submit"
            isPending={isPending}
          >
            {t('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
