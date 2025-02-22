import { useCallback } from 'react'

import { Upload } from 'lucide-react'
import { type Accept, useDropzone } from 'react-dropzone'

import { useEventCallback } from '../hooks'
import { cn } from '../lib/utils'

export interface FileDropzoneProps {
  onUpload: (file: File) => void
  accept: Accept
}
export const FileDropzone = ({ onUpload, accept }: FileDropzoneProps) => {
  const onUploadCallback = useEventCallback(onUpload)

  const onDrop = useCallback((files: File[]) => {
    onUploadCallback?.(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group flex flex-col items-center gap-10 px-10 py-[25%] border-2 border-dashed border-slate-300 bg-slate-50 active:text-brand cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-colors',
        isDragActive && 'border-brand'
      )}
    >
      <Upload
        className={cn(
          'size-24 text-slate-400 group-active:text-brand',
          isDragActive && 'text-brand'
        )}
      />
      <h6
        className={cn(
          'text-sm text-center text-slate-400 font-medium group-active:text-brand group-hover:text-slate-500',
          isDragActive && 'text-brand'
        )}
      >
        Перетащите сюда файлы для загрузки или щелкните, чтобы выбрать файлы на вашем устройстве.
      </h6>
      <input {...getInputProps()} />
    </div>
  )
}
