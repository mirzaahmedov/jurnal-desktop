import { useCallback } from 'react'

import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { type Accept, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { useEventCallback } from '../hooks'
import { cn } from '../lib/utils'
import { Upload } from './icons/Upload'

export interface FileDropzoneProps {
  onUpload: (file: File) => void
  accept: Accept
}
export const FileDropzone = ({ onUpload, accept }: FileDropzoneProps) => {
  const { t } = useTranslation()

  const onUploadCallback = useEventCallback(onUpload)

  const onDrop = useCallback((files: File[]) => {
    onUploadCallback?.(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept
  })

  return (
    <AspectRatio
      {...getRootProps()}
      ratio={1}
      className={cn(
        'group flex flex-col items-center justify-center gap-2.5 px-10 border-4 border-dashed border-slate-300 bg-slate-50 active:text-brand cursor-pointer hover:bg-slate-100 hover:border-slate-400 rounded-lg transition-colors',
        isDragActive && 'border-brand'
      )}
    >
      <Upload
        className={cn(
          'size-40 text-slate-300 group-hover:text-slate-400 group-hover:scale-105 group-active:text-brand transition-all',
          isDragActive && 'text-brand'
        )}
      />
      <h6
        className={cn(
          'w-full max-w-xs text-sm text-center text-slate-400 font-medium group-active:text-brand group-hover:text-slate-500 transition-colors',
          isDragActive && 'text-brand'
        )}
      >
        {t('drop_or_select_file')}
      </h6>
      <input {...getInputProps()} />
    </AspectRatio>
  )
}
