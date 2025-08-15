import type { CommissionMember } from './components/signatures'
import type { MaterialPrixodProvodka } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect } from 'react'

import { CircleX, Plus } from 'lucide-react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Fieldset } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Label } from '@/common/components/jolly/field'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { GenerateFile } from '@/common/features/file'

import { AktPriyomReport } from './akt-priyom'

interface IMaterialAktPriyomStore {
  headerText: string
  commissionBoss: CommissionMember[]
  commissionMembers: CommissionMember[]
  commissionSecretary: CommissionMember[]
  setValues: (values: Omit<IMaterialAktPriyomStore, 'setValues'>) => void
}
const useMaterialAktPriyomStore = create(
  persist<IMaterialAktPriyomStore>(
    (set, get) => ({
      headerText: `Харид килинган моддий товарларни кабул килиш буйича комиссия раиси: Бошкарма бошлигининг уринбосари майор М.Мансуров, комиссия аъзолари; Шахсий хавфсизлик бўлими бош инспектори майор А.Толлиев, Хизмат ва жанговор тайоргарликни ташкил этиш бўлими бошлиги подполковник А.Айдаров, Радиацион, кимёовий ва тиббий-биологик мухофазани ташкил этиш бўлими бошлиги майор С.Шодиев, комиссия котиби; Моддий -техник таъминот бўлими бошлиги капитан Н. Узакбаев.`,
      commissionBoss: [
        {
          fio: '',
          military_rank: ''
        }
      ],
      commissionMembers: [
        {
          fio: '',
          military_rank: ''
        }
      ],
      commissionSecretary: [
        {
          fio: '',
          military_rank: ''
        }
      ],
      setValues: (values) => {
        set({
          ...values,
          setValues: get().setValues
        })
      }
    }),
    {
      name: 'material_akt_priyom'
    }
  )
)

interface AktPriyomDialogProps extends Omit<DialogTriggerProps, 'children'> {
  docNum: string
  docDate: string
  dovernost: string
  products: MaterialPrixodProvodka[]
}
export const AktPriyomDialog: FC<AktPriyomDialogProps> = ({
  docNum,
  docDate,
  dovernost,
  products,
  ...props
}) => {
  const { t } = useTranslation()
  const { headerText, commissionBoss, commissionMembers, commissionSecretary, setValues } =
    useMaterialAktPriyomStore()

  const form = useForm({
    defaultValues: {
      headerText,
      commissionBoss,
      commissionMembers,
      commissionSecretary
    }
  })

  const bossFields = useFieldArray({
    control: form.control,
    name: 'commissionBoss'
  })
  const memberFields = useFieldArray({
    control: form.control,
    name: 'commissionMembers'
  })
  const secretaryFields = useFieldArray({
    control: form.control,
    name: 'commissionSecretary'
  })

  const values = useWatch({
    control: form.control
  })
  useEffect(() => {
    setValues({
      headerText: values.headerText ?? '',
      commissionBoss: values.commissionBoss ?? ([] as any),
      commissionMembers: values.commissionMembers ?? ([] as any),
      commissionSecretary: values.commissionSecretary ?? ([] as any)
    })
  }, [values, setValues])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="h-full max-h-full w-full max-w-3xl flex flex-col">
          <DialogHeader className="pb-5 border-b border-slate-200">
            <DialogTitle>{t('receive_akt')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className="-mx-5 px-5 flex-1 overflow-y-auto scrollbar"
            >
              <div className="py-4 space-y-2.5">
                <FormField
                  control={form.control}
                  name="headerText"
                  render={({ field }) => (
                    <Textarea
                      spellCheck={false}
                      rows={6}
                      className="scrollbar"
                      {...field}
                    />
                  )}
                />

                <Fieldset
                  name={t('commission_boss')}
                  className="p-0 gap-2.5"
                >
                  <ul className="divide-y">
                    <li className="flex flex-row gap-2 px-0 py-2.5">
                      <Label className="flex-1">{t('fio')}</Label>
                      <Label className="flex-1">{t('military_rank')}</Label>
                      <div className="w-8"></div>
                    </li>
                    {bossFields.fields.map((boss, index) => (
                      <li
                        key={boss.id}
                        className="flex flex-row gap-2 px-0 py-2.5"
                      >
                        <FormField
                          control={form.control}
                          name={`commissionBoss.${index}.fio`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="flex-1"
                            />
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`commissionBoss.${index}.military_rank`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="flex-1"
                            />
                          )}
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => bossFields.remove(index)}
                        >
                          <CircleX className="btn-icon text-destructive" />
                        </Button>
                      </li>
                    ))}
                    <li className="border-none">
                      <Button
                        IconStart={Plus}
                        onClick={() =>
                          bossFields.append({
                            fio: '',
                            military_rank: ''
                          })
                        }
                        variant="outline"
                        className="w-full hover:bg-neutral-50"
                      >
                        {t('add')}
                      </Button>
                    </li>
                  </ul>
                </Fieldset>

                <Fieldset
                  name={t('commission_members')}
                  className="p-0 gap-2.5"
                >
                  <ul className="divide-y">
                    <li className="flex flex-row gap-2 px-0 py-2.5">
                      <Label className="flex-1">{t('fio')}</Label>
                      <Label className="flex-1">{t('military_rank')}</Label>
                      <div className="w-8"></div>
                    </li>
                    {memberFields.fields.map((member, index) => (
                      <li
                        key={member.id}
                        className="flex flex-row gap-2 px-0 py-2.5"
                      >
                        <FormField
                          control={form.control}
                          name={`commissionMembers.${index}.fio`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="flex-1"
                            />
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`commissionMembers.${index}.military_rank`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="flex-1"
                            />
                          )}
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => memberFields.remove(index)}
                        >
                          <CircleX className="btn-icon text-destructive" />
                        </Button>
                      </li>
                    ))}
                    <li className="border-none">
                      <Button
                        IconStart={Plus}
                        onClick={() =>
                          memberFields.append({
                            fio: '',
                            military_rank: ''
                          })
                        }
                        variant="outline"
                        className="w-full hover:bg-neutral-50"
                      >
                        {t('add')}
                      </Button>
                    </li>
                  </ul>
                </Fieldset>

                <Fieldset
                  name={t('commission_secretary')}
                  className="p-0 gap-2.5"
                >
                  <ul className="divide-y">
                    <li className="flex flex-row gap-2 px-0 py-2.5">
                      <Label className="flex-1">{t('fio')}</Label>
                      <Label className="flex-1">{t('military_rank')}</Label>
                      <div className="w-8"></div>
                    </li>
                    {secretaryFields.fields.map((secretary, index) => (
                      <li
                        key={secretary.id}
                        className="flex flex-row gap-2 px-0 py-2.5"
                      >
                        <FormField
                          control={form.control}
                          name={`commissionSecretary.${index}.fio`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="flex-1"
                            />
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`commissionSecretary.${index}.military_rank`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="flex-1"
                            />
                          )}
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => secretaryFields.remove(index)}
                        >
                          <CircleX className="btn-icon text-destructive" />
                        </Button>
                      </li>
                    ))}
                    <li className="border-none">
                      <Button
                        IconStart={Plus}
                        onClick={() =>
                          secretaryFields.append({
                            fio: '',
                            military_rank: ''
                          })
                        }
                        variant="outline"
                        className="w-full hover:bg-neutral-50"
                      >
                        {t('add')}
                      </Button>
                    </li>
                  </ul>
                </Fieldset>
              </div>
            </form>
          </Form>
          <div className="grid place-content-center border-t border-slate-200 pt-5">
            <GenerateFile
              fileName={`${t('receive_akt')}_${docNum}.pdf`}
              buttonText={t('receive_akt')}
            >
              <AktPriyomReport
                docNum={docNum}
                docDate={docDate}
                commissionBoss={form.watch('commissionBoss')}
                commissionMembers={form.watch('commissionMembers')}
                commissionSecretary={form.watch('commissionSecretary')}
                dovernost={dovernost}
                products={products}
                headerText={form.watch('headerText')}
              />
            </GenerateFile>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
