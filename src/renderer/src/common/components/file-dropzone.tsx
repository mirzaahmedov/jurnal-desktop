import { type ComponentProps, type ComponentType, type HTMLAttributes, useCallback } from 'react'

import { AspectRatio, type AspectRatioProps } from '@radix-ui/react-aspect-ratio'
import { type Accept, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { UploadCloud } from '@/common/assets/illustrations/upload-cloud'
import { cn } from '@/common/lib/utils'

import { useEventCallback } from '../hooks'

export interface FileDropzoneProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    Omit<AspectRatioProps, 'onSelect'> {
  onSelect: (file: File) => void
  accept?: Accept
  label?: string
  icon?: ComponentType
  iconProps?: ComponentProps<typeof UploadCloud>
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

  const Icon = icon ? icon : UploadCloud

  return (
    <AspectRatio
      {...getRootProps()}
      ratio={1}
      className={cn(
        'group flex flex-col items-center justify-center px-10 border-4 border-dashed border-slate-200 bg-slate-50 active:text-brand cursor-pointer hover:border-slate-300 rounded-lg transition-colors',
        isDragActive && 'border-brand'
      )}
      {...props}
    >
      <Icon
        {...iconProps}
        className={cn(
          'h-72 text-slate-300 group-hover:text-slate-400/80 group-hover:scale-110 group-active:text-brand transition-all duration-300',
          isDragActive && 'text-brand',
          iconProps?.className
        )}
      />
      <h6
        className={cn(
          'w-full max-w-xs text-sm text-center text-slate-400 font-medium group-active:text-brand transition-colors',
          isDragActive && 'text-brand'
        )}
      >
        {label ? label : t('drop_or_select_file')}
      </h6>
      <input {...getInputProps()} />
    </AspectRatio>
  )
}
