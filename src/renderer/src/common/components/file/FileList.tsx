import type { FC, HTMLAttributes } from 'react'

import { FileText, FileVideo, Trash2 } from 'lucide-react'
import millify from 'millify'

import { FileDropzone } from '@/common/components'
import { Button } from '@/common/components/ui/button'

export interface FileListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  file: File | null
  onSelect: (file: File | null) => void
}
export const FileList: FC<FileListProps> = ({ file, onSelect, ...props }) => {
  return (
    <div {...props}>
      {file ? (
        <div className="flex items-center gap-4 bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-indigo-50 text-indigo-600 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <b className="text-sm truncate">{file.name}</b>
              <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                {(file.name.split('.').pop() || '').toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {millify(file.size, { space: true, units: ['', 'KB', 'MB', 'GB'] })}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600"
            onClick={() => onSelect(null)}
            aria-label="Remove file"
          >
            <Trash2 />
          </Button>
        </div>
      ) : (
        <FileDropzone
          onSelect={onSelect}
          icon={FileVideo}
          iconProps={{
            className: 'size-20 mb-5'
          }}
          ratio={2 / 1}
        />
      )}
    </div>
  )
}
