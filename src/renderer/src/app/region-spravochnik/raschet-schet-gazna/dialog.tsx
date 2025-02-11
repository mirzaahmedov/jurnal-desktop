import type { RaschetSchetGazna } from '@/common/models'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
import { useToast } from '@/common/hooks/use-toast'

import { defaultValues, raschetSchetGaznaQueryKeys } from './constants'
import { RaschetSchetGaznaFormSchema, raschetSchetGaznaService } from './service'

type RaschetSchetGaznaDialogProps = {
  open: boolean
  onChangeOpen(value: boolean): void
  data: RaschetSchetGazna | null
  orgId: number
}
export const RaschetSchetGaznaDialog = ({
  open,
  onChangeOpen,
  data,
  orgId
}: RaschetSchetGaznaDialogProps) => {
  const { toast } = useToast()
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(RaschetSchetGaznaFormSchema)
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: [raschetSchetGaznaQueryKeys.create],
    mutationFn: raschetSchetGaznaService.create,
    onSuccess() {
      toast({
        title: 'Состав успешно создан'
      })
      form.reset(defaultValues)
      queryClient.invalidateQueries({
        queryKey: [raschetSchetGaznaQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось создать состав',
        description: error.message
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: [raschetSchetGaznaQueryKeys.update],
    mutationFn: raschetSchetGaznaService.update,
    onSuccess() {
      toast({
        title: 'Состав успешно обновлена'
      })
      queryClient.invalidateQueries({
        queryKey: [raschetSchetGaznaQueryKeys.getAll]
      })
      onChangeOpen(false)
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Не удалось обновить состав',
        description: error.message
      })
    }
  })

  const onSubmit = form.handleSubmit(({ raschet_schet_gazna }) => {
    if (data) {
      update({
        id: data.gazna.id,
        raschet_schet_gazna,
        spravochnik_organization_id: orgId
      })
    } else {
      create({
        raschet_schet_gazna,
        spravochnik_organization_id: orgId
      })
    }
  })

  useEffect(() => {
    if (!data) {
      form.reset(defaultValues)
      return
    }

    form.reset(data?.gazna)
  }, [form, data])

  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {data
              ? t('update-something', { something: t('raschet-schet-gazna') })
              : t('create-something', { something: t('raschet-schet-gazna') })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4 py-4">
              <FormField
                name="raschet_schet_gazna"
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
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
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
