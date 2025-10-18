import type { FeedbackForm } from './config'

import { useMutation } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FileList } from '@/common/components/file/FileList'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { DialogContent, DialogOverlay, DialogTrigger } from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { useAuthStore } from '@/common/features/auth'

import { FeedbackService } from './service'
import { useFeedbackModalState } from './store'

export const SendFeedbackModal = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { details, isOpen, close } = useFeedbackModalState()

  const form = useForm({
    defaultValues: {
      user_id: user?.id ?? 0,
      message: '',
      file: null,
      meta_data: details || '{}'
    } satisfies FeedbackForm
  })
  const createFeedback = useMutation({
    mutationFn: FeedbackService.create
  })

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData()

    formData.append('user_id', (user?.id ?? 0).toString())
    formData.append('message', values.message)
    formData.append('meta_data', details || '{}')
    if (values.file) {
      formData.append('file', values.file)
    }

    createFeedback.mutate(formData, {
      onSuccess: () => {
        toast.success(t('feedback_sent_successfully'))
        close()
      }
    })
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(openState) => {
        if (!openState) {
          close()
        }
      }}
    >
      <DialogOverlay>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label={t('message')}
                  >
                    <Textarea {...field} />
                  </FormElement>
                )}
              />
              <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label={t('additional_file')}
                    className="mt-5"
                  >
                    <FileList
                      file={field.value}
                      onSelect={field.onChange}
                      className="mt-2.5"
                    />
                  </FormElement>
                )}
              />
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  IconStart={SendIcon}
                >
                  {t('send')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
