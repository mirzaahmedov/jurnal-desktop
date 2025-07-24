import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MainZarplataTable } from '@/app/jur_5/common/features/main-zarplata/main-zarplata-table'
import { useMainZarplataList } from '@/app/jur_5/common/features/main-zarplata/use-fetchers'
import { LoadingOverlay, Spinner } from '@/common/components'
import { EditableTable } from '@/common/components/editable-table'
import { createEditorDeleteHandler } from '@/common/components/editable-table/helpers'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { MonthSelect } from '@/common/components/month-select'
import { Badge } from '@/common/components/ui/badge'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { YearSelect } from '@/common/components/year-select'
import { parseDate } from '@/common/lib/date'
import { getWorkdaysInMonth } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { TabelFormSchema, type TabelFormValues, defaultValues } from '../config'
import { TabelService } from '../service'
import { TabelEditableColumnDefs } from './tabel-provodka-editable-table'
import { TabelVacantsFilter } from './tabel-vacants-filter'

enum TabelFormTabs {
  SELECT = 'select',
  SELECTED = 'selected'
}

export interface TabelCreateFormProps {
  budjetId: number
  mainSchetId: number
  vacants: VacantTreeNode[]
  vacantId: number | undefined
  isPending?: boolean
  onSubmit: (values: TabelFormValues) => void
}
export const TabelCreateForm = ({
  budjetId,
  mainSchetId,
  vacants,
  vacantId,
  isPending,
  onSubmit
}: TabelCreateFormProps) => {
  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues,
    resolver: zodResolver(TabelFormSchema)
  })

  const [activeTab, setActiveTab] = useState<TabelFormTabs>(TabelFormTabs.SELECT)
  const [visibleVacant, setVisibleVacant] = useState<number | null>(null)

  const mainZarplataQuery = useMainZarplataList({
    vacantId
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
      mainSchetId
    })
  })

  useEffect(() => {
    getMaxDocNum()
  }, [getMaxDocNum])

  const tabelChildren = form.watch('tabelChildren')
  const selectedIds = useMemo(() => {
    return tabelChildren.map((item) => item.mainZarplataId)
  }, [tabelChildren])
  const handleClickRow = useCallback(
    (row: MainZarplata) => {
      const prev = form.getValues('tabelChildren')

      if (prev.find((item) => item.mainZarplataId === row.id)) {
        prev.splice(
          prev.findIndex((item) => item.mainZarplataId === row.id),
          1
        )
      } else {
        prev.push({
          mainZarplataId: row.id,
          fio: row.fio,
          doljnost: row.doljnostName,
          vacantId: row.vacantId,
          rabDni: getWorkdaysInMonth(
            form.getValues('tabelYear'),
            form.getValues('tabelMonth'),
            parseInt(row.spravochnikZarplataGrafikRabotiName || '0')
          ).workdays,
          otrabDni: 0,
          noch: 0,
          prazdnik: 0,
          pererabodka: 0,
          kazarma: 0
        })
      }

      form.setValue('tabelChildren', [...prev])
    },
    [form]
  )

  const selectedVacants = useMemo(() => {
    const vacantIds = new Map<number, number>()
    const vacantNodes: (VacantTreeNode & { _selectedCount: number })[] = []
    tabelChildren.forEach((child) => {
      if (!vacantIds.has(child.vacantId)) {
        vacantIds.set(child.vacantId, 0)
      }
      vacantIds.set(child.vacantId, vacantIds.get(child.vacantId)! + 1)
    })
    const walk = (node: VacantTreeNode) => {
      if (vacantIds.has(node.id)) {
        vacantNodes.push({
          ...node,
          _selectedCount: vacantIds.get(node.id) ?? 0
        })
      }
      node.children.forEach(walk)
    }
    vacants.forEach((vacant) => {
      walk(vacant)
    })
    return vacantNodes
  }, [tabelChildren, vacants])

  const isAllSelected = useMemo(() => {
    if (!mainZarplataQuery.data?.length) return false
    return mainZarplataQuery?.data?.every((item) => selectedIds.includes(item.id)) ?? false
  }, [mainZarplataQuery?.data, selectedIds])
  const handleSelectAll = useCallback(() => {
    const prev = form.getValues('tabelChildren')
    if (isAllSelected) {
      console.log('Removing all selected rows')
      form.setValue(
        'tabelChildren',
        prev.filter(
          (item) => !mainZarplataQuery.data?.find((row) => row.id === item.mainZarplataId)
        )
      )
    } else {
      const missingChildren = mainZarplataQuery.data?.filter(
        (row) => !prev.some((item) => item.mainZarplataId === row.id)
      )
      form.setValue('tabelChildren', [
        ...prev,
        ...(missingChildren ?? []).map((row) => ({
          mainZarplataId: row.id,
          vacantId: row.vacantId,
          fio: row.fio,
          doljnost: row.doljnostName,
          rabDni: getWorkdaysInMonth(
            form.getValues('tabelYear'),
            form.getValues('tabelMonth'),
            parseInt(row.spravochnikZarplataGrafikRabotiName || '0')
          ).workdays,
          otrabDni: 0,
          noch: 0,
          prazdnik: 0,
          pererabodka: 0,
          kazarma: 0
        }))
      ])
    }
  }, [form, isAllSelected, mainZarplataQuery.data])

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
                  <Badge className="-m-2 ml-2">{form.watch('tabelChildren').length}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === TabelFormTabs.SELECT && (
              <div className="w-full">
                <Button
                  variant="ghost"
                  className="flex items-center h-auto py-1 px-0 gap-2 hover:!bg-transparent"
                  onClick={handleSelectAll}
                >
                  <Checkbox isSelected={isAllSelected} />
                  <span className="text-xs">
                    {isAllSelected ? t('deselect_all') : t('select_all')}
                  </span>
                </Button>
              </div>
            )}
            {activeTab === TabelFormTabs.SELECTED && (
              <TabelVacantsFilter
                selectedVacants={selectedVacants}
                selectedCount={form.watch('tabelChildren')?.length ?? 0}
                visibleVacant={visibleVacant}
                setVisibleVacant={setVisibleVacant}
              />
            )}

            {activeTab === TabelFormTabs.SELECT && (
              <div className="relative w-full overflow-auto scrollbar pl-px">
                {mainZarplataQuery.isFetching && <LoadingOverlay />}
                <MainZarplataTable
                  data={mainZarplataQuery.data ?? []}
                  selectedIds={selectedIds}
                  onClickRow={handleClickRow}
                />
              </div>
            )}
            {activeTab === TabelFormTabs.SELECTED && (
              <div className="relative w-full overflow-auto scrollbar pl-px">
                {mainZarplataQuery.isFetching && <LoadingOverlay />}
                <EditableTable
                  form={form}
                  name="tabelChildren"
                  columnDefs={TabelEditableColumnDefs as any}
                  onDelete={createEditorDeleteHandler({
                    form
                  })}
                  isRowVisible={({ row }) =>
                    visibleVacant ? row.vacantId === visibleVacant : true
                  }
                />
              </div>
            )}
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
