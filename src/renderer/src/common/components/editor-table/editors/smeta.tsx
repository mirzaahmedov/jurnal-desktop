import { Pressable } from 'react-aria-components'
import { Controller } from 'react-hook-form'

import { createSmetaSpravochnik } from '@/app/super-admin/smeta'
import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useToggle } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { createEditor, inputVariants } from './utils'

export const smetaEditor = createEditor<{
  getSmetaInfo: (row: any) => {
    smeta_number: string
    smeta_name: string
  }
  setSmetaInfo: (row: { smeta_number: string; smeta_name: string; rowIndex: number }) => void
}>(
  ({
    form,
    arrayField,
    originalIndex,
    colDef,
    disabled,
    className,
    inputRef,
    getSmetaInfo,
    setSmetaInfo,
    ...props
  }) => {
    const tooltipToggle = useToggle()

    const smetaSpravochnik = useSpravochnik(
      createSmetaSpravochnik({
        onChange: (value, smeta) => {
          form.setValue(`${arrayField}.${originalIndex}.${colDef?.colId}`, value, {
            shouldValidate: true
          })
          setSmetaInfo({
            smeta_name: smeta?.smeta_name ?? '',
            smeta_number: smeta?.smeta_number ?? '',
            rowIndex: originalIndex
          })
        }
      })
    )

    const row = form.watch(`${arrayField}.${originalIndex}`)
    const { smeta_number, smeta_name } = getSmetaInfo?.(row) ?? {}

    return (
      <Controller
        name={`${arrayField}.${originalIndex}.${colDef?.field}`}
        control={form.control}
        render={({ field }) => (
          <TooltipTrigger
            delay={100}
            isOpen={tooltipToggle.isOpen}
            onOpenChange={tooltipToggle.setOpen}
          >
            <Pressable isDisabled={!props.value}>
              <input
                {...props}
                readOnly
                value={smeta_number}
                className={cn(inputVariants(), className)}
                disabled={disabled}
                onDoubleClick={smetaSpravochnik.open}
                ref={(e) => {
                  if (e) inputRef.current = e
                  field.ref(e)
                }}
              />
            </Pressable>
            {props.value ? (
              <Tooltip
                className="bg-white text-foreground shadow-xl p-5 min-w-96 max-w-2xl"
                placement="left"
              >
                <p className="text-sm">{smeta_name}</p>
              </Tooltip>
            ) : null}
          </TooltipTrigger>
        )}
      />
    )
  }
)
