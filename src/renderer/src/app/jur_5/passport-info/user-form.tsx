import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import {
  ZarplataSpravochnikService,
  createZarplataSpravochnik
} from '@/app/super-admin/zarplata/spravochnik/service'
import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { parseDate } from '@/common/lib/date'

import { getVacantRayon } from '../common/utils/vacant'
import { MainZarplataFormSchema, defaultValues } from './config'

export interface MainZarplataFormProps {
  vacant: VacantTreeNode
}
export const MainZarplataForm = ({ vacant }: MainZarplataFormProps) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(MainZarplataFormSchema),
    defaultValues
  })

  const { data: grafiks } = useQuery({
    queryKey: [
      ZarplataSpravochnikService.QueryKeys.GetAll,
      {
        page: 1,
        limit: 100000,
        types_type_code: ZarplataSpravochnikType.GrafikRaboty
      }
    ],
    queryFn: ZarplataSpravochnikService.getAll
  })
  const { mutate: createUser, isPending } = useMutation({
    mutationFn: MainZarplataService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetAll]
      })
    }
  })

  const zarplataZvanieSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      value: form.watch('spravochikZarplataZvanieId'),
      onChange: (value) => form.setValue('spravochikZarplataZvanieId', value ?? 0),
      params: {
        types_type_code: ZarplataSpravochnikType.Zvanie
      }
    })
  )

  const handleSubmit = form.handleSubmit((values) => {
    createUser({
      ...values,
      vacantId: vacant.id
    })
  })

  useEffect(() => {
    form.setValue('rayon', getVacantRayon(vacant))
  }, [vacant])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5"
      >
        <div className="p-2.5 grid grid-cols-[repeat(2,minmax(200px,1fr))] content-center gap-5">
          <FormField
            control={form.control}
            name="kartochka"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('card_num')}
              >
                <Input {...field} />
              </FormElement>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="xarbiy"
              render={({ field }) => (
                <FormElement
                  label={t('military')}
                  divProps={{ className: 'flex-row-reverse justify-end' }}
                  innerProps={{ className: 'flex-none w-auto' }}
                >
                  <Checkbox
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormElement>
              )}
            />
            <FormField
              control={form.control}
              name="ostanovitRaschet"
              render={({ field }) => (
                <FormElement
                  label={t('stop_calculation')}
                  divProps={{ className: 'flex-row-reverse justify-end' }}
                  innerProps={{ className: 'flex-none w-auto' }}
                >
                  <Checkbox
                    ref={field.ref}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormElement>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="fio"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('fio')}
              >
                <Input {...field} />
              </FormElement>
            )}
          />
          <FormField
            control={form.control}
            name="dateBirth"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('date_of_birth')}
              >
                <JollyDatePicker {...field} />
              </FormElement>
            )}
          />

          <FormField
            control={form.control}
            name="spravochnikZarplataGrafikRabotiId"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('grafik')}
              >
                <JollySelect
                  buttonRef={field.ref}
                  items={grafiks?.data || []}
                  selectedKey={field.value}
                  onSelectionChange={field.onChange}
                >
                  {(item) => <SelectItem>{item.name}</SelectItem>}
                </JollySelect>
              </FormElement>
            )}
          />
          <FormField
            control={form.control}
            name="nachaloSlujbi"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('start_of_service')}
              >
                <JollyDatePicker {...field} />
              </FormElement>
            )}
          />

          <FormField
            control={form.control}
            name="spravochikZarplataZvanieId"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('military_rank')}
              >
                <SpravochnikInput
                  {...zarplataZvanieSpravochnik}
                  inputRef={field.ref}
                  getInputValue={(selected) => selected?.name || ''}
                />
              </FormElement>
            )}
          />
          <FormField
            control={form.control}
            name="inn"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('inn')}
              >
                <Input {...field} />
              </FormElement>
            )}
          />

          <div></div>
          <FormField
            control={form.control}
            name="inps"
            render={({ field }) => (
              <FormElement
                direction="column"
                label={t('inps')}
              >
                <Input {...field} />
              </FormElement>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="rayon"
              render={({ field }) => (
                <FormElement
                  direction="column"
                  label={t('rayon')}
                >
                  <Textarea
                    {...field}
                    readOnly
                  />
                </FormElement>
              )}
            />
          </div>

          <Fieldset name={t('shtatka')}></Fieldset>

          <div className="col-span-2">
            <Button
              type="submit"
              isPending={isPending}
            >
              {t('save')}
            </Button>
          </div>
        </div>
        <div className="p-10">
          <div className="flex flex-col items-center gap-10">
            <div className="border w-[200px] h-[calc(200px/3*4)] bg-gray-100 rounded-lg">
              <img
                src="/images/profile_placeholder.png"
                alt="Profile placeholder"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <TimeElapsed start={form.watch('nachaloSlujbi')} />
          </div>
        </div>
      </form>
    </Form>
  )
}

const calculateDateDifference = (startDate: Date, endDate: Date) => {
  if (!(startDate instanceof Date)) startDate = new Date(startDate)
  if (!(endDate instanceof Date)) endDate = new Date(endDate)

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

const TimeElapsed = ({ start }: { start: string }) => {
  if (!start) return null

  const { t } = useTranslation()
  const { years, months, days } = calculateDateDifference(parseDate(start), new Date())

  const FlipCard = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="bg-black text-white text-3xl font-mono rounded-md px-4 py-2 shadow-inner border-2 border-gray-700 min-w-[60px] text-center select-none flex flex-col items-center justify-center">
        <span>{value}</span>
        <span className="text-xs text-gray-300 mt-1">{label}</span>
      </div>
    </div>
  )

  return (
    <div className="flex items-end gap-2">
      <FlipCard
        value={years}
        label={t('year')}
      />
      <FlipCard
        value={months}
        label={t('month')}
      />
      <FlipCard
        value={days}
        label={t('day')}
      />
    </div>
  )
}
