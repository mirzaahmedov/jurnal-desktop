import type { FormEventHandler, ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form } from '@/common/components/ui/form'

export type FormDialogProps<T extends Record<string, unknown>> = {
  name: string
  open: boolean
  onChangeOpen(value: boolean): void
  form: UseFormReturn<T>
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
  footer: ReactNode
}
export const FormDialog = <T extends Record<string, unknown>>(props: FormDialogProps<T>) => {
  const { name, open, onChangeOpen, form, onSubmit, children, footer } = props
  return (
    <Dialog
      open={open}
      onOpenChange={onChangeOpen}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            {children}
            <DialogFooter>{footer}</DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
