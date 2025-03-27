import { type ComponentProps, type ComponentType, type HTMLAttributes, useCallback } from 'react'

import { AspectRatio, type AspectRatioProps } from '@radix-ui/react-aspect-ratio'
import { type Accept, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { cn } from '@/common/lib/utils'

import { useEventCallback } from '../hooks'
import { Upload } from './icons/Upload'

export interface FileDropzoneProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    Omit<AspectRatioProps, 'onSelect'> {
  onSelect: (file: File) => void
  accept?: Accept
  label?: string
  icon?: ComponentType
  iconProps?: ComponentProps<typeof Upload>
}
export const FileDropzone = ({
  onSelect,
  accept,
  label,
  icon,
  iconProps,
  ...props
}: FileDropzoneProps) => {
  const { t } = useTranslation()

  const onSelectEvent = useEventCallback(onSelect)

  const onDrop = useCallback((files: File[]) => {
    onSelectEvent?.(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept
  })

  const Icon = icon ? icon : Upload

  return (
    <AspectRatio
      {...getRootProps()}
      ratio={1}
      className={cn(
        'group flex flex-col items-center justify-center gap-2.5 px-10 border-4 border-dashed border-slate-300 bg-slate-50 active:text-brand cursor-pointer hover:bg-slate-100 hover:border-slate-400 rounded-lg transition-colors',
        isDragActive && 'border-brand'
      )}
      {...props}
    >
      <Icon
        {...iconProps}
        className={cn(
          'size-40 text-slate-300 group-hover:text-slate-400/80 group-hover:scale-105 group-active:text-brand transition-all',
          isDragActive && 'text-brand',
          iconProps?.className
        )}
      />
      <h6
        className={cn(
          'w-full max-w-xs text-xs text-center text-slate-400 font-medium group-active:text-brand group-hover:text-slate-500 transition-colors',
          isDragActive && 'text-brand'
        )}
      >
        {label ? label : t('drop_or_select_file')}
      </h6>
      <input {...getInputProps()} />
    </AspectRatio>
  )
}
