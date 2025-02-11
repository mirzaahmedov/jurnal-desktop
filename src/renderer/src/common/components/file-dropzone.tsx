import { useCallback } from 'react'

import { Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

import { useEventCallback } from '../hooks'
import { cn } from '../lib/utils'

export interface FileDropzoneProps {
  onUpload: (file: File) => void
}
export const FileDropzone = ({ onUpload }: FileDropzoneProps) => {
  const onUploadCallback = useEventCallback(onUpload)

  const onDrop = useCallback((files: File[]) => {
    onUploadCallback?.(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group flex flex-col items-center gap-10 px-10 py-[25%] border-4 border-dashed border-slate-300 active:text-brand cursor-pointer',
        isDragActive && 'border-brand'
      )}
    >
      <Upload
        className={cn(
          'size-32 text-slate-400 group-active:text-brand',
          isDragActive && 'text-brand'
        )}
      />
      <h6
        className={cn(
          'text-xs text-center font-normal text-slate-400 group-active:text-brand',
          isDragActive && 'text-brand'
        )}
      >
        Перетащите сюда файлы для загрузки или щелкните, чтобы выбрать файлы на вашем устройстве.
      </h6>
      <input {...getInputProps()} />
    </div>
  )
}
