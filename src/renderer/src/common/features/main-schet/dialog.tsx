import { SelectField } from '@/common/components'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter
} from '@/common/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { budgetService, budgetQueryKeys } from '@/app/super-admin/budjet'
import { getMainSchetsQuery } from './service'
import { queryKeys } from './constants'
import { useAuthStore } from '@/common/features/auth'
import { useMainSchet } from './store'
import { Button } from '@/common/components/ui/button'
import { useEffect } from 'react'

export type MainSchetDialogProps = {
  open: boolean
  onOpenChange: (value: boolean) => void
}
export const MainSchetDialog = (props: MainSchetDialogProps) => {
  const { open, onOpenChange } = props
  const { user } = useAuthStore()
  const { main_schet, setMainSchet } = useMainSchet()

  const form = useForm({ defaultValues })

  const { data: budgetList, isLoading: isLoadingBudget } = useQuery({
    queryKey: [budgetQueryKeys.getAll],
    queryFn: budgetService.getAll
  })
  const { data: schetList, isLoading: isLoadingSchets } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        budget_id: form.watch('budget_id'),
        region_id: user?.region_id ?? 0
      }
    ],
    queryFn: getMainSchetsQuery,
    enabled: !!form.watch('budget_id') && !!user?.region_id
  })

  const handleSubmit = () => {
    const id = form.watch('main_schet_id')
    if (!schetList || !user || !id) {
      return
    }

    const found = schetList.data?.find((schet) => schet.main_schet_id === Number(id))
    if (!found) {
      return
    }

    const { account_number, main_schet_id } = found ?? {}

    setMainSchet({
      id: main_schet_id,
      account_number: account_number,
      user_id: user.id,
      budget_id: form.getValues('budget_id')
    })
    onOpenChange(false)
  }

  useEffect(() => {
    if (open) {
      form.setValue('budget_id', main_schet?.budget_id ?? 0)
      form.setValue('main_schet_id', main_schet?.id ?? 0)
    }
  }, [form, open, main_schet])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Выберите основной счет</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <FormField
            control={form.control}
            name="budget_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Бюджет</FormLabel>
                <SelectField
                  {...field}
                  withFormControl
                  disabled={isLoadingBudget}
                  placeholder="Выберите бюджет"
                  options={Array.isArray(budgetList?.data) ? budgetList.data : []}
                  getOptionValue={(budget) => budget.id.toString()}
                  getOptionLabel={(budget) => budget.name}
                  value={field.value ? field.value.toString() : ''}
                  onValueChange={(value) => {
                    form.setValue('main_schet_id', 0)
                    field.onChange(Number(value))
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('budget_id') && user?.region_id ? (
            <FormField
              control={form.control}
              name="main_schet_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Расчетный счет</FormLabel>
                  <SelectField
                    {...field}
                    withFormControl
                    disabled={isLoadingSchets}
                    placeholder="Выберите расчетный счет"
                    options={Array.isArray(schetList?.data) ? schetList.data : []}
                    getOptionValue={(account) => account.main_schet_id.toString()}
                    getOptionLabel={(account) => account.account_number}
                    value={field.value ? field.value.toString() : ''}
                    onValueChange={(value) => field.onChange(Number(value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </Form>
        <DialogFooter>
          <Button disabled={!form.watch('main_schet_id')} onClick={handleSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
const defaultValues = {
  budget_id: 0,
  main_schet_id: 0
}
