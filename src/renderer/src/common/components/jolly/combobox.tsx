'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import { ChevronsUpDown } from 'lucide-react'
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  type ListBoxProps as AriaListBoxProps,
  type PopoverProps as AriaPopoverProps,
  type ValidationResult as AriaValidationResult,
  type ListBoxRenderProps,
  Text,
  composeRenderProps
} from 'react-aria-components'

import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'
import { Button } from './button'
import { FieldError, FieldGroup, Label } from './field'
import { ListBoxCollection, ListBoxHeader, ListBoxItem, ListBoxSection } from './list-box'
import { Popover } from './popover'

const Combobox = AriaComboBox

const ComboboxItem = ListBoxItem

const ComboboxHeader = ListBoxHeader

const ComboboxSection = ListBoxSection

const ComboboxCollection = ListBoxCollection

const ComboboxInput = ({
  className,
  inputRef,
  ...props
}: AriaInputProps & { inputRef?: React.Ref<HTMLInputElement> }) => (
  <AriaInput
    className={composeRenderProps(className, (className) =>
      cn(
        'flex h-10 w-full bg-background px-3 py-2 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
        /* Disabled */
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className
      )
    )}
    ref={inputRef}
    {...props}
  />
)

const ComboboxPopover = ({ className, ...props }: AriaPopoverProps) => (
  <Popover
    className={composeRenderProps(className, (className) =>
      cn('w-[calc(var(--trigger-width)+4px)]', className)
    )}
    {...props}
  />
)

const ComboboxListBox = <T extends object>({ className, ...props }: AriaListBoxProps<T>) => (
  <AriaListBox
    className={composeRenderProps(className, (className) =>
      cn(
        'max-h-[400px] overflow-auto scrollbar p-1 outline-none [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]',
        className
      )
    )}
    {...props}
  />
)

const comboboxVariants = cva('group flex flex-col gap-2', {
  variants: {
    error: {
      true: ''
    },
    editor: {
      true: 'm-0.5 gap-0 [&>div]:border-none [&>div]:bg-transparent [&>div]:rounded-none [&_input]:bg-transparent'
    }
  }
})

interface JollyComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, 'children'>,
    VariantProps<typeof comboboxVariants> {
  hideLabel?: boolean
  label?: string
  placeholder?: string
  description?: string | null
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  inputProps?: Omit<AriaInputProps, 'children'>
  popoverProps?: Omit<AriaPopoverProps, 'children'>
  tabIndex?: number
  editor?: boolean
  children: React.ReactNode | ((item: T) => React.ReactNode)
  renderEmptyState?: (props: ListBoxRenderProps) => React.ReactNode
}
function JollyComboBox<T extends object>({
  label,
  hideLabel = false,
  description,
  placeholder,
  errorMessage,
  className,
  inputProps,
  popoverProps,
  children,
  tabIndex,
  error,
  editor = false,
  renderEmptyState,
  ...props
}: JollyComboBoxProps<T>) {
  return (
    <Combobox
      className={composeRenderProps(className, (className) =>
        cn(comboboxVariants({ editor, error }), className)
      )}
      {...props}
    >
      {!hideLabel && <Label>{label}</Label>}
      <FieldGroup
        className="p-0"
        error={error}
        editor={editor}
      >
        <ComboboxInput
          placeholder={placeholder}
          tabIndex={tabIndex}
          data-error={error ? 'true' : undefined}
          {...inputProps}
        />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 p-1"
        >
          <ChevronsUpDown
            aria-hidden="true"
            className="size-4 opacity-50"
          />
        </Button>
      </FieldGroup>
      {description && (
        <Text
          className="text-sm text-muted-foreground"
          slot="description"
        >
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <ComboboxPopover {...popoverProps}>
        <ComboboxListBox
          renderEmptyState={(props) =>
            renderEmptyState ? (
              renderEmptyState?.(props)
            ) : (
              <div className="text-center text-xs px-5 py-5 grid place-content-center">
                <EmptyList className="w-full max-w-32" />
              </div>
            )
          }
        >
          {children}
        </ComboboxListBox>
      </ComboboxPopover>
    </Combobox>
  )
}

export {
  ComboboxSection,
  Combobox,
  ComboboxListBox,
  ComboboxInput,
  ComboboxCollection,
  ComboboxItem,
  ComboboxHeader,
  ComboboxPopover,
  JollyComboBox
}
export type { JollyComboBoxProps }
