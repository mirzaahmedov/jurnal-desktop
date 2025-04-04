import { useMemo } from 'react'

import { FileVideo, Trash2 } from 'lucide-react'
import millify from 'millify'

import { FileDropzone } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { VideoPlayer } from '@/common/components/video-player'

export interface VideoUploadProps {
  file: File | null
  onSelect: (file: File | null) => void
}
export const VideoUpload = ({ file, onSelect }: VideoUploadProps) => {
  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  return (
    <div className="pt-5 border-t">
      {file ? (
        <div className="flex items-center gap-5">
          {filePreview ? (
            <VideoPlayer
              className="w-40"
              src={filePreview}
            />
          ) : null}
          <div className="flex flex-col gap-1 flex-1">
            <b className="text-sm">{file.name}</b>
            <span className="text-sm">
              {millify(file.size, {
                space: true,
                units: ['', 'KB', 'MB', 'GB']
              })}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-500"
            onClick={() => onSelect(null)}
          >
            <Trash2 />
          </Button>
        </div>
      ) : (
        <FileDropzone
          onSelect={onSelect}
          icon={FileVideo}
          iconProps={{
            className: 'size-20'
          }}
          ratio={2 / 1}
        />
      )}
    </div>
  )
}
