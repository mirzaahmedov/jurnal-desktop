import { type MouseEvent, useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormElement } from '@/common/components/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'

import { useConfirm } from './store'

export const ConfirmationDialog = () => {
  const { t } = useTranslation(['sign-in'])

  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const form = useForm({
    defaultValues: {
      password: ''
    }
  })

  const {
    isOpen,
    title = t('sure_to_delete'),
    withPassword: password,
    description,
    close,
    onConfirm,
    onCancel
  } = useConfirm()

  useEffect(() => {
    if (isOpen) {
      form.reset()
      setPasswordVisible(false)
    }
  }, [isOpen])

  const handleConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    if (password) {
      const password = form.getValues('password')
      if (!password || password.trim().length === 0) {
        form.setError('password', {
          type: 'custom',
          message: t('required_field')
        })
        e.preventDefault()
        return
      }
      onConfirm?.(password)
    } else {
      onConfirm?.()
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={close}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {password ? (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormElement
                    direction="column"
                    label={t('password')}
                  >
                    <Input
                      autoFocus
                      type={isPasswordVisible ? 'text' : 'password'}
                      {...field}
                    />
                  </FormElement>
                )}
              />
            </form>
            <div className="flex items-center gap-2 mt-3">
              <Checkbox
                checked={isPasswordVisible}
                onCheckedChange={(state) => setPasswordVisible(!!state)}
                className="size-5"
              />
              <Label className="mt-0">{t('show-password')}</Label>
            </div>
          </Form>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className="text-xs"
          >
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="text-xs"
          >
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
