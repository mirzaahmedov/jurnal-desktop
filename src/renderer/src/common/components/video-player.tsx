import type { DetailedHTMLProps, HTMLAttributes, SourceHTMLAttributes } from 'react'

import {
  BigPlayButton,
  ControlBar,
  ForwardControl,
  PlayToggle,
  Player,
  ReplayControl
} from 'video-react'

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
      <Player preload="none">
        <source
          {...sourceProps}
          src={src}
        />
        <BigPlayButton position="center" />
        <ControlBar>
          <PlayToggle />
          <ReplayControl seconds={5} />
          <ForwardControl seconds={5} />
        </ControlBar>
      </Player>
    </div>
  )
}
