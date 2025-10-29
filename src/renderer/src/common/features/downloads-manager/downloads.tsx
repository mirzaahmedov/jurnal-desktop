import { CircleArrowDown } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

import { EmptyList } from '@/common/components/empty-states'
import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'
import { Badge } from '@/common/components/ui/badge'

import { FileItem } from './file-item'
import { useDownloadsManagerStore } from './store'

export const Downloads = () => {
  const { t } = useTranslation(['app'])
  const { files, removeFile, clearFiles } = useDownloadsManagerStore()

  return (
    <PopoverTrigger>
      <TooltipTrigger delay={300}>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <CircleArrowDown className="icon icon-md" />
          {files.length ? (
            <Badge className="absolute top-0 right-0 text-2xs px-1.5 min-w-5 h-5">
              {files.length}
            </Badge>
          ) : null}
        </Button>
        <Tooltip>{t('app.downloads')}</Tooltip>
      </TooltipTrigger>
      <Popover placement="top end">
        <PopoverDialog className="p-0 text-foreground overflow-hidden max-w-md min-w-[400px] h-full min-h-[300px] flex flex-col">
          {files.length ? (
            <div className="p-2.5 flex items-center justify-end border-b">
              <Button
                variant="link"
                className="text-xs font-bold text-slate-500"
                onPress={clearFiles}
              >
                <Trans>clear_all</Trans>
              </Button>
            </div>
          ) : null}
          {files.length ? (
            <div className="p-0 m-0 divide-y flex-1">
              {files.map((file) => (
                <FileItem
                  key={file.path}
                  fileName={file.name}
                  filePath={file.path}
                  fileSize={file.size}
                  downloadedAt={file.downloadedAt}
                  onRemove={removeFile}
                  onOpen={window.downloader.openFile}
                  onOpenFileInFolder={window.downloader.openFileInFolder}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center flex-1">
              <EmptyList>
                <Trans>no_downloaded_files</Trans>
              </EmptyList>
            </div>
          )}
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
