import type { IZarplataPodpis } from '@/common/models/zarplata_podpis'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { ZarplataPodpisType } from '@/common/models/zarplata_podpis'

import { type ZarplataPodpisForm, ZarplataPodpisFormSchema, zarplataTypeOptions } from './config'
import { ZarplataPodpisService, ZarplataQueryKeys } from './service'

export interface ZarplataPodpisDialogProps extends Omit<DialogTriggerProps, 'children'> {
  podpisData?: IZarplataPodpis
}
export const ZarplataPodpisDialog: FC<ZarplataPodpisDialogProps> = ({ podpisData, ...props }) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(ZarplataPodpisFormSchema),
    defaultValues: {
      position: '',
      fio: '',
      type: ZarplataPodpisType.MonthlyVedemost
    } satisfies ZarplataPodpisForm as ZarplataPodpisForm
  })

  const podpisCreate = useMutation({
    mutationFn: ZarplataPodpisService.create
  })
  const podpisUpdate = useMutation({
    mutationFn: (values: ZarplataPodpisForm) =>
      ZarplataPodpisService.update(podpisData?.id ?? 0, values)
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (podpisData) {
      podpisUpdate.mutate(values, {
        onSuccess: () => {
          props?.onOpenChange?.(false)
          queryClient.invalidateQueries({
            queryKey: ZarplataQueryKeys.getAll()
          })
        }
      })
    } else {
      podpisCreate.mutate(values, {
        onSuccess: () => {
          props?.onOpenChange?.(false)
          queryClient.invalidateQueries({
            queryKey: ZarplataQueryKeys.getAll()
          })
        }
      })
    }
  })

  useEffect(() => {
    if (podpisData) {
      form.reset(podpisData)
    } else {
      form.reset({
        position: '',
        fio: '',
        type: ZarplataPodpisType.MonthlyVedemost
      })
    }
  }, [podpisData, form])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {podpisData
                ? t('podpis')
                : t('create-something', { something: t('podpis').toLowerCase() })}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
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
                name="position"
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label={t('doljnost')}
                  >
                    <Input {...field} />
                  </FormElement>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label={t('type')}
                  >
                    <JollySelect
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      items={zarplataTypeOptions}
                    >
                      {(item) => {
                        return <SelectItem id={item.value}>{item.value}</SelectItem>
                      }}
                    </JollySelect>
                  </FormElement>
                )}
              />

              <DialogFooter className="mt-5 pt-5 border-t">
                <Button type="submit">{t('save')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
