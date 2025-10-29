'use client'

import { forwardRef } from 'react'

import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
  type ValidationResult as AriaValidationResult,
  Text,
  composeRenderProps
} from 'react-aria-components'

import { CheckIcon } from '@/common/assets/icons/check'
import { cn } from '@/common/lib/utils'

import { FieldError, Label, labelVariants } from './field'

const CheckboxGroup = AriaCheckboxGroup

const Checkbox = forwardRef<HTMLLabelElement, AriaCheckboxProps>(
  ({ className, children, ...props }, ref) => (
    <AriaCheckbox
      ref={ref}
      className={composeRenderProps(className, (className) =>
        cn(
          'group/checkbox flex items-center gap-x-2',
          /* Disabled */
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70',
          labelVariants,
          className
        )
      )}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          <div
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-sm border text-current ring-offset-background',
              /* Focus Visible */
              'group-data-[focus-visible]/checkbox:outline-none group-data-[focus-visible]/checkbox:ring-2 group-data-[focus-visible]/checkbox:ring-ring group-data-[focus-visible]/checkbox:ring-offset-2',
              /* Selected */
              'group-data-[indeterminate]/checkbox:bg-brand group-data-[indeterminate]/checkbox:border-brand group-data-[selected]/checkbox:bg-brand group-data-[selected]/checkbox:border-brand group-data-[indeterminate]/checkbox:text-primary-foreground  group-data-[selected]/checkbox:text-primary-foreground',
              /* Disabled */
              'group-data-[disabled]/checkbox:cursor-not-allowed group-data-[disabled]/checkbox:opacity-50',
              /* Invalid */
              'group-data-[invalid]/checkbox:border-destructive group-data-[invalid]/checkbox:group-data-[selected]/checkbox:bg-destructive group-data-[invalid]/checkbox:group-data-[selected]/checkbox:text-destructive-foreground',
              /* Resets */
              'focus:outline-none focus-visible:outline-none'
            )}
          >
            {renderProps.isIndeterminate ? (
              <span className="h-[3px] w-3/5 rounded bg-current" />
            ) : renderProps.isSelected ? (
              <CheckIcon className="size-2.5" />
            ) : null}
          </div>
          {children}
        </>
      ))}
    </AriaCheckbox>
  )
)

interface JollyCheckboxGroupProps extends AriaCheckboxGroupProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function JollyCheckboxGroup({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: JollyCheckboxGroupProps) {
  return (
    <CheckboxGroup
      className={composeRenderProps(className, (className) =>
        cn('group flex flex-col gap-2', className)
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          <Label>{label}</Label>
          {children}
          {description && (
            <Text
              className="text-sm text-muted-foreground"
              slot="description"
            >
              {description}
            </Text>
          )}
          <FieldError>{errorMessage}</FieldError>
        </>
      ))}
    </CheckboxGroup>
  )
}

export { Checkbox, CheckboxGroup, JollyCheckboxGroup }
export type { JollyCheckboxGroupProps }
