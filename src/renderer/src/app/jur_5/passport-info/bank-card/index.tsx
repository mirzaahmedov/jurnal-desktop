import type { MainZarplata } from '@/common/models'

import { type FC, useEffect } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/jolly/button'
import { Form } from '@/common/components/ui/form'
import { MainZarplataService } from '@/common/features/main-zarplata/service'

import { defaultValues } from '../config'
import { BankCardForm } from './bank-card-form'

export interface BankCardProps {
  mainZarplataData?: MainZarplata
}
export const BankCard: FC<BankCardProps> = ({ mainZarplataData }) => {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues
  })

  const { t } = useTranslation()

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: [MainZarplataService.QueryKeys.GetAll]
    })
    queryClient.invalidateQueries({
      queryKey: [MainZarplataService.QueryKeys.GetByVacantId]
    })
    queryClient.invalidateQueries({
      queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplataData?.id ?? 0]
    })
  }
  const updateMainZarplata = useMutation({
    mutationFn: MainZarplataService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      invalidateQueries()
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const handleSubmit = () => {
    if (!mainZarplataData) return

    const values = form.getValues()
    updateMainZarplata.mutate({
      id: mainZarplataData.id,
      values
    })
  }

  useEffect(() => {
    if (mainZarplataData) {
      form.reset({
        ...mainZarplataData,
        bank: mainZarplataData.bank ?? '',
        fioDop: mainZarplataData.fioDop ?? '',
        raschetSchet: mainZarplataData.raschetSchet ?? ''
      })
    } else {
      form.reset(defaultValues)
    }
  }, [mainZarplataData, form])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex justify-start px-10"
          >
            <BankCardForm form={form} />
          </form>
        </Form>
      </div>

      <div className="w-full p-5 border-t">
        <Button
          type="button"
          isPending={updateMainZarplata.isPending}
          onPress={() => handleSubmit()}
        >
          {t('save')}
        </Button>
      </div>
    </div>
  )
}
