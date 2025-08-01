import type { MainSchet } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useAsyncListBank } from '@/app/super-admin/bank/service'
import { BudjetSelect } from '@/app/super-admin/budjet/budjet-select'
import { AutoComplete } from '@/common/components/auto-complete'
import { FormElement } from '@/common/components/form'
import { ComboboxItem } from '@/common/components/jolly/combobox'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { RequisitesQueryKeys } from '@/common/features/requisites'
import { capitalize } from '@/common/lib/string'
import { normalizeSpaces } from '@/common/lib/text'

import { MainSchetFormSchema, MainSchetQueryKeys, defaultValues } from './config'
import { useBudjetId } from './filters'
import { MainSchetService } from './service'

export interface MainSchetDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: MainSchet | null
  original?: MainSchet
}
export const MainSchetDialog = ({
  isOpen,
  onOpenChange,
  selected,
  original
}: MainSchetDialogProps) => {
  const queryClient = useQueryClient()
  const [budjetId] = useBudjetId()

  const mfoBankList = useAsyncListBank()
  const nameBankList = useAsyncListBank()

  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      spravochnik_budjet_name_id: budjetId!
    },
    resolver: zodResolver(MainSchetFormSchema)
  })

  const { mutate: createMainSchet, isPending: isCreatingMainSchet } = useMutation({
    mutationKey: [MainSchetQueryKeys.create],
    mutationFn: MainSchetService.create,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [MainSchetQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [RequisitesQueryKeys.duplicates]
      })
      onOpenChange?.(false)
    }
  })
  const { mutate: updateMainSchet, isPending: isUpdatingMainSchet } = useMutation({
    mutationKey: [MainSchetQueryKeys.update],
    mutationFn: MainSchetService.update,
    onSuccess(res) {
      form.reset(defaultValues)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [MainSchetQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [RequisitesQueryKeys.duplicates]
      })
      onOpenChange?.(false)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (selected) {
      updateMainSchet({
        ...values,
        id: selected.id
      })
    } else {
      createMainSchet(values)
    }
  })

  useEffect(() => {
    if (!selected) {
      form.reset(
        original
          ? {
              ...defaultValues,
              spravochnik_budjet_name_id: budjetId,
              tashkilot_nomi: original.tashkilot_nomi,
              tashkilot_mfo: original.tashkilot_mfo,
              tashkilot_bank: original.tashkilot_bank,
              tashkilot_inn: original.tashkilot_inn,
              account_name: original.account_name
            }
          : {
              ...defaultValues,
              spravochnik_budjet_name_id: budjetId
            }
      )
      return
    }

    form.reset(selected)
  }, [form, selected, original, budjetId])

  const {
    fields: jur152Schets,
    append: appendJur152Schets,
    remove: removeJur152Schets
  } = useFieldArray({
    control: form.control,
    name: 'jur3_schets_152'
  })
  const {
    fields: jur159Schets,
    append: appendJur159Schets,
    remove: removeJur159Schets
  } = useFieldArray({
    control: form.control,
    name: 'jur3_schets_159'
  })
  const {
    fields: jur4Schets,
    append: appendJur4Schets,
    remove: removeJur4Schets
  } = useFieldArray({
    control: form.control,
    name: 'jur4_schets'
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="h-full max-h-[700px] max-w-2xl flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('main-schet')
                : capitalize(
                    t('create-something', {
                      something: t('main-schet')
                    })
                  )}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="overflow-y-auto noscroll-bar p-1"
            >
              <div className="grid gap-4 py-4">
                <FormField
                  name="spravochnik_budjet_name_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('budjet')}</FormLabel>
                        <BudjetSelect
                          isReadOnly
                          selectedKey={field.value}
                          onSelectionChange={field.onChange}
                          className="col-span-4"
                        />
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="account_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('name')}</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="account_number"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">
                          {t('raschet-schet')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="gazna_number"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">
                          {t('raschet-schet-gazna')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="tashkilot_nomi"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('organization')}</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="tashkilot_inn"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">{t('inn')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-4"
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="tashkilot_mfo"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      grid="2:4"
                      label={t('mfo')}
                    >
                      <AutoComplete
                        items={mfoBankList.items}
                        inputValue={mfoBankList.filterText}
                        onInputChange={mfoBankList.setFilterText}
                        selectedKey={field.value}
                        onSelectionChange={(key) => {
                          field.onChange(key)
                          const selectedBank = mfoBankList.items.find((item) => item.mfo === key)
                          if (selectedBank) {
                            form.setValue('tashkilot_bank', selectedBank.bank_name)
                          }
                        }}
                      >
                        {(item) => (
                          <ComboboxItem id={item.mfo}>
                            {item.mfo} - {normalizeSpaces(item.bank_name)}
                          </ComboboxItem>
                        )}
                      </AutoComplete>
                    </FormElement>
                  )}
                />

                <FormField
                  name="tashkilot_bank"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      grid="2:4"
                      label={t('bank')}
                    >
                      <FormControl>
                        <AutoComplete
                          items={nameBankList.items}
                          inputValue={nameBankList.filterText}
                          onInputChange={nameBankList.setFilterText}
                          selectedKey={field.value}
                          onSelectionChange={(key) => {
                            field.onChange(key)
                            const selectedBank = nameBankList.items.find(
                              (item) => item.bank_name === key
                            )
                            if (selectedBank) {
                              form.setValue('tashkilot_mfo', selectedBank.mfo)
                            }
                          }}
                        >
                          {(item) => (
                            <ComboboxItem id={item.bank_name}>
                              {item.mfo} - {normalizeSpaces(item.bank_name)}
                            </ComboboxItem>
                          )}
                        </AutoComplete>
                      </FormControl>
                    </FormElement>
                  )}
                />

                <FormField
                  name="jur1_schet"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">
                          {t('mo-nth', { nth: 1 })} <span className="lowercase">{t('schet')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="jur2_schet"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1">
                        <FormLabel className="text-right col-span-2">
                          {t('mo-nth', { nth: 2 })} <span className="lowercase">{t('schet')}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end col-span-6" />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-6 gap-5 items-center">
                  <FormLabel className="col-span-2 text-end">
                    {t('mo-nth', { nth: '3-152' })} {t('schet')}
                  </FormLabel>
                </div>
                <ul className="flex flex-col gap-6">
                  {jur152Schets.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`jur3_schets_152.${index}.schet`}
                      render={({ field }) => (
                        <li key={index}>
                          <FormElement
                            grid="2:4"
                            label={index + 1}
                          >
                            <div className="flex items-center justify-between gap-5">
                              <Input {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="btn-icon !mx-0 hover:text-red-500"
                                disabled={jur152Schets.length === 1}
                                onClick={() => removeJur152Schets(index)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </FormElement>
                        </li>
                      )}
                    />
                  ))}
                </ul>
                <div className="grid grid-cols-6 mt-1">
                  <div className="col-span-2"></div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendJur152Schets({
                        schet: ''
                      })
                    }
                    className="col-span-4"
                  >
                    <Plus className="btn-icon icon-start" /> {t('add')}
                  </Button>
                </div>

                <div className="grid grid-cols-6 gap-5 items-center">
                  <FormLabel className="col-span-2 text-end">
                    {t('mo-nth', { nth: '3-159' })} {t('schet')}
                  </FormLabel>
                </div>
                <ul className="flex flex-col gap-6">
                  {jur159Schets.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`jur3_schets_159.${index}.schet`}
                      render={({ field }) => (
                        <li key={index}>
                          <FormElement
                            grid="2:4"
                            label={index + 1}
                          >
                            <div className="flex items-center justify-between gap-5">
                              <Input {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="btn-icon !mx-0 hover:text-red-500"
                                disabled={jur159Schets.length === 1}
                                onClick={() => removeJur159Schets(index)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </FormElement>
                        </li>
                      )}
                    />
                  ))}
                </ul>
                <div className="grid grid-cols-6 mt-1">
                  <div className="col-span-2"></div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendJur159Schets({
                        schet: ''
                      })
                    }
                    className="col-span-4"
                  >
                    <Plus className="btn-icon icon-start" /> {t('add')}
                  </Button>
                </div>

                <div className="grid grid-cols-6 gap-5 items-center">
                  <FormLabel className="col-span-2 text-end">
                    {t('mo-nth', { nth: 4 })} {t('schet')}
                  </FormLabel>
                </div>
                <ul className="flex flex-col gap-6">
                  {jur4Schets.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`jur4_schets.${index}.schet`}
                      render={({ field }) => (
                        <li key={index}>
                          <FormElement
                            grid="2:4"
                            label={index + 1}
                          >
                            <div className="flex items-center justify-between gap-5">
                              <Input {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="btn-icon !mx-0 hover:text-red-500"
                                disabled={jur4Schets.length === 1}
                                onClick={() => removeJur4Schets(index)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </FormElement>
                        </li>
                      )}
                    />
                  ))}
                </ul>
                <div className="grid grid-cols-6 mt-1">
                  <div className="col-span-2"></div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendJur4Schets({
                        schet: ''
                      })
                    }
                    className="col-span-4"
                  >
                    <Plus className="btn-icon icon-start" /> {t('add')}
                  </Button>
                </div>
              </div>
              <DialogFooter className="w-full mt-5 sticky bottom-0 bg-white shadow-[0px_5px_0px_5px_white]">
                <Button
                  type="submit"
                  disabled={isCreatingMainSchet || isUpdatingMainSchet}
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
