import type { DetailedHTMLProps, HTMLAttributes, SourceHTMLAttributes } from 'react'

import { BigPlayButton, Player } from 'video-react'

import { cn } from '../lib/utils'

export interface VideoPlayerProps extends HTMLAttributes<HTMLDivElement> {
  src: string | undefined
  sourceProps?: Omit<
    DetailedHTMLProps<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>,
    'src'
  >
}
export const VideoPlayer = ({ sourceProps, src, className, ...props }: VideoPlayerProps) => {
  return (
    <div
      className={cn('rounded-md overflow-hidden', className)}
      {...props}
    >
      <Player>
        <source
          {...sourceProps}
          src={src}
        />
        <BigPlayButton position="center" />
      </Player>
    </div>
  )
}
