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
      <Popover
        placement="top end"
        className=""
      >
        <PopoverDialog className="w-full max-w-2xl p-0 text-foreground">
          {files.length ? (
            <div className="p-2.5 flex items-center justify-end">
              <Button
                variant="link"
                className="text-xs font-bold text-slate-500"
                onPress={clearFiles}
              >
                <Trans>clear_all</Trans>
              </Button>
            </div>
          ) : null}
          <div className="divide-y">
            {files.length ? (
              files.map((file) => (
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
              ))
            ) : (
              <div className="py-10 px-32">
                <EmptyList>
                  <Trans>no_downloaded_files</Trans>
                </EmptyList>
              </div>
            )}
          </div>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
