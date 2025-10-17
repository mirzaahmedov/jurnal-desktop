import type { FeedbackForm } from './config'

import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { DialogContent, DialogOverlay, DialogTrigger } from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'

import { FeedbackService } from './service'
import { useFeedbackModalState } from './store'

export const SendFeedbackModal = () => {
  const { t } = useTranslation()
  const { isOpen, open, close } = useFeedbackModalState()

  const form = useForm({
    defaultValues: {
      user_id: 0,
      message: '',
      file: null,
      meta_data: ''
    } satisfies FeedbackForm
  })
  const createFeedback = useMutation({
    mutationFn: FeedbackService.create
  })

  const handleSubmit = form.handleSubmit((values) => {
    createFeedback.mutate(values, {
      onSuccess: () => {
        toast.success(t('feedback_sent_successfully'))
      }
    })
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(value) => (value ? open() : close())}
    >
      <DialogOverlay>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormElement label={t('Feedback Message')}>
                    <Textarea {...field} />
                  </FormElement>
                )}
              />
              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormElement label={t('Feedback Message')}>
                    <Textarea {...field} />
                  </FormElement>
                )}
              />
              <Button type="submit">{t('send')}</Button>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
