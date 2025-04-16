import type { MainSchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { bankQueryKeys } from '@/app/super-admin/bank/config'
import { bankService } from '@/app/super-admin/bank/service'
import { BudgetService } from '@/app/super-admin/budjet'
import { BudjetQueryKeys } from '@/app/super-admin/budjet/config'
import { AutoComplete, SelectField } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { RequisitesQueryKeys, useRequisitesStore } from '@/common/features/requisites'

import { MainSchetFormSchema, MainSchetQueryKeys, defaultValues } from './config'
import { MainSchetService } from './service'

export interface MainSchetDialogProps {
  open: boolean
  onChangeOpen: (value: boolean) => void
  selected: MainSchet | null
  original?: MainSchet
}
export const MainSchetDialog = ({
  open,
  onChangeOpen,
  selected,
  original
}: MainSchetDialogProps) => {
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const [search, setSearch] = useState('')

  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      spravochnik_budjet_name_id: budjet_id!
    },
    resolver: zodResolver(MainSchetFormSchema)
  })

  const { data: bankList, isFetching } = useQuery({
    queryKey: [bankQueryKeys.getAll, { search }],
    queryFn: bankService.getAll,
    enabled: !!search,
    placeholderData: (prev) => prev
  })

  const { data: budgets } = useQuery({
    queryKey: [BudjetQueryKeys.getAll],
    queryFn: BudgetService.getAll
  })

  const { mutate: createMainSchet, isPending: isCreatingMainSchet } = useMutation({
    mutationKey: [MainSchetQueryKeys.create],
    mutationFn: MainSchetService.create,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [MainSchetQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [RequisitesQueryKeys.duplicates]
      })
      onChangeOpen(false)
    }
  })
  const { mutate: updateMainSchet, isPending: isUpdatingMainSchet } = useMutation({
    mutationKey: [MainSchetQueryKeys.update],
    mutationFn: MainSchetService.update,
    onSuccess(res) {
      toast.success(res?.message)
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [MainSchetQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [RequisitesQueryKeys.duplicates]
      })
      onChangeOpen(false)
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
              spravochnik_budjet_name_id: budjet_id,
              tashkilot_nomi: original.tashkilot_nomi,
              tashkilot_mfo: original.tashkilot_mfo,
              tashkilot_bank: original.tashkilot_bank,
              tashkilot_inn: original.tashkilot_inn,
              account_name: original.account_name
            }
          : {
              ...defaultValues,
              spravochnik_budjet_name_id: budjet_id
            }
      )
      return
    }

    form.reset(selected)
  }, [form, selected, original])

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
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="h-full max-h-[700px] max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selected
              ? t('update-something', {
                  something: t('main-schet')
                })
              : t('create-something', {
                  something: t('main-schet')
                })}
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
                      <SelectField
                        {...field}
                        withFormControl
                        disabled={true}
                        triggerClassName="col-span-4 disabled:opacity-100"
                        placeholder={t('choose', { what: t('budjet') })}
                        options={budgets?.data ?? []}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(value) => field.onChange(Number(value))}
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
                      <FormLabel className="text-right col-span-2">{t('raschet-schet')}</FormLabel>
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
                      isFetching={isFetching}
                      disabled={search === ''}
                      options={bankList?.data ?? []}
                      className="col-span-4"
                      getOptionLabel={(option) => `${option.mfo} ${option.bank_name}`}
                      getOptionValue={(option) => option.mfo}
                      onSelect={(option) => {
                        form.setValue('tashkilot_mfo', option.mfo)
                        form.setValue('tashkilot_bank', option.bank_name)
                        setSearch('')
                      }}
                    >
                      {({ open, close }) => (
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            console.log('e.target.value', e.target.value)
                            setSearch(e.target.value)
                          }}
                          onFocus={open}
                          onBlur={() => {
                            setSearch('')
                            close()
                            field.onBlur()
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                            }
                          }}
                        />
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
                        isFetching={isFetching}
                        disabled={search === ''}
                        options={bankList?.data ?? []}
                        className="col-span-4"
                        getOptionLabel={(option) => `${option.mfo} ${option.bank_name}`}
                        getOptionValue={(option) => option.mfo}
                        onSelect={(option) => {
                          form.setValue('tashkilot_mfo', option.mfo)
                          form.setValue('tashkilot_bank', option.bank_name)
                          setSearch('')
                        }}
                      >
                        {({ open, close }) => (
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setSearch(e.target.value)
                            }}
                            onFocus={open}
                            onBlur={() => {
                              setSearch('')
                              close()
                              field.onBlur()
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                              }
                            }}
                          />
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
    </Dialog>
  )
}
