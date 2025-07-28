import type { Workplace } from '@/common/models/workplace'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CopyPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { WorkplaceService } from '@/common/features/workplace/service'
import { useToggle } from '@/common/hooks'

export interface WorkplaceDuplicateProps {
  values: Workplace
}
export const WorkplaceDuplicate = ({ values }: WorkplaceDuplicateProps) => {
  const { t } = useTranslation(['app'])
  const queryClient = useQueryClient()

  const { mutateAsync: createWorkplace, isPending } = useMutation({
    mutationFn: WorkplaceService.createWorkplace,
    onError: () => {
      toast.error(t('create_failed'))
    }
  })

  const popoverToggle = useToggle()
  const form = useForm({
    defaultValues: {
      count: 1
    }
  })
  const handleSubmit = form.handleSubmit(async ({ count }) => {
    const results = await Promise.allSettled(
      Array.from({ length: count }).map(() => createWorkplace(values))
    )
    if (results.some((result) => result.status === 'rejected')) {
      toast.error(t('update_failed_some'))
    }
    queryClient.invalidateQueries({
      queryKey: [WorkplaceService.QueryKeys.GetAll]
    })
    popoverToggle.close()
  })

  return (
    <PopoverTrigger
      isOpen={popoverToggle.isOpen}
      onOpenChange={popoverToggle.setOpen}
    >
      <Button
        size="icon"
        variant="ghost"
      >
        <CopyPlus className="btn-icon" />
      </Button>
      <Popover>
        <PopoverDialog>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormElement label={t('count')}>
                    <Input
                      type="number"
                      {...field}
                      className="w-28"
                    />
                  </FormElement>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                isPending={isPending}
              >
                {t('add')}
              </Button>
            </form>
          </Form>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
