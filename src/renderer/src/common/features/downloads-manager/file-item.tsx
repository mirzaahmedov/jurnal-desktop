import { CircleX, ExternalLink, Folder } from 'lucide-react'
import millify from 'millify'

import { XlsFile } from '@/common/components/icons/XlsFile'
import { Button } from '@/common/components/jolly/button'
import { formatLocaleDateTime } from '@/common/lib/format'

export interface FileItemProps {
  fileName: string
  filePath: string
  fileSize: number
  downloadedAt: Date
  onRemove: (filePath: string) => void
  onOpen: (filePath: string) => void
  onOpenFileInFolder: (filePath: string) => void
}
export const FileItem = ({
  fileName,
  filePath,
  fileSize,
  downloadedAt,
  onRemove,
  onOpen,
  onOpenFileInFolder
}: FileItemProps) => {
  return (
    <div className="px-5 py-4 flex items-center gap-5 hover:bg-slate-50 has-[button:hover]:bg-transparent cursor-pointer transition-colors">
      <div className="rounded-full size-12 flex items-center justify-center bg-slate-100">
        <XlsFile />
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm break-all text-slate-700 line-clamp-2">{fileName}</p>
        <div className="space-x-5">
          <span className="text-xs font-medium text-slate-500 mt-1">
            {millify(fileSize, {
              space: true,
              units: ['', 'KB', 'MB', 'GB']
            })}
          </span>
          <span className="text-xs font-medium text-slate-500 mt-1">
            {formatLocaleDateTime(downloadedAt.toString())}
          </span>
        </div>
      </div>
      <div>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => {
            onOpen(filePath)
          }}
        >
          <ExternalLink className="btn-icon icon-sm" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => {
            onOpenFileInFolder(filePath)
          }}
        >
          <Folder className="btn-icon icon-sm" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onPress={() => {
            onRemove(filePath)
          }}
        >
          <CircleX className="btn-icon icon-sm" />
        </Button>
      </div>
    </div>
  )
}
