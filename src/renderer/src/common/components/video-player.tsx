import type { DetailedHTMLProps, HTMLAttributes, SourceHTMLAttributes } from 'react'

import { Pressable } from 'react-aria-components'
import {
  BigPlayButton,
  ControlBar,
  ForwardControl,
  PlayToggle,
  Player,
  ReplayControl
} from 'video-react'

import { cn } from '@/common/lib/utils'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from './jolly/dialog'

export interface VideoPlayerProps extends HTMLAttributes<HTMLDivElement> {
  src: string | undefined
  title: string | undefined
  sourceProps?: Omit<
    DetailedHTMLProps<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>,
    'src'
  >
}
export const VideoPlayer = ({ sourceProps, src, title, className, ...props }: VideoPlayerProps) => {
  return (
    <DialogTrigger>
      <Pressable>
        <div
          className={cn('rounded-md overflow-hidden cursor-pointer', className)}
          {...props}
        >
          <Player preload="none">
            <source
              {...sourceProps}
              src={src}
            />
            <BigPlayButton
              position="center"
              className="pointer-events-none"
            />
            <ControlBar></ControlBar>
          </Player>
        </div>
      </Pressable>
      <DialogOverlay>
        <DialogContent className="w-full max-w-9xl p-1.5 pt-5">
          <DialogHeader className="px-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="rounded overflow-hidden">
            <Player
              preload="none"
              autoPlay
            >
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
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
