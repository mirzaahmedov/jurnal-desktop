import { type InputHTMLAttributes, useId } from 'react'

import { Button, type ButtonProps } from './ui/button'

export interface RadioButton extends InputHTMLAttributes<HTMLInputElement> {
  buttonProps?: ButtonProps
}
export const RadioButton = ({ children, buttonProps = {}, ...props }: RadioButton) => {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className="cursor-pointer"
    >
      <input
        {...props}
        type="radio"
        id={id}
        className="hidden"
      />
      <Button
        className="border border-slate-300 size-12 grid place-content-center text-slate-500 [input:checked+&]:border-blue-500 [input:checked+&]:bg-blue-100 [input:checked+&]:text-blue-500  rounded-md pointer-events-none"
        type="button"
        variant="ghost"
        {...buttonProps}
      >
        {children}
      </Button>
    </label>
  )
}
