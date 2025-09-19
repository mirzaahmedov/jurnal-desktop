import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, type ReactNode, useEffect } from 'react'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { FormElementUncontrolled } from '@/common/components/form/form-element-uncontrolled'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Textarea } from '@/common/components/ui/textarea'

export interface UseReportCommentsStore {
  comments: Record<string, string>
  setComments: (values: Record<string, string>) => void
  setComment: (id: string, value: string) => void
  clearComments: () => void
}
export const useReportCommentsStore = create(
  persist<UseReportCommentsStore>(
    (set) => ({
      comments: {},
      setComments: (comments) => {
        set({
          comments
        })
      },
      setComment: (id, comment) => {
        set((state) => ({
          comments: {
            ...state.comments,
            [id]: comment
          }
        }))
      },
      clearComments: () => {
        set({
          comments: {}
        })
      }
    }),
    {
      name: 'comments-store'
    }
  )
)

export interface ReportCommentModalContextProps extends Omit<DialogTriggerProps, 'children'> {
  reportId: string
  children: (props: { comment: string }) => ReactNode
  reportTitle: string
  buttonText: string
  beforeContent?: ReactNode
  afterContent?: ReactNode
  defaultValue?: string
}
export const ReportCommentModalProvider: FC<ReportCommentModalContextProps> = ({
  reportId,
  children,
  buttonText,
  reportTitle,
  beforeContent,
  afterContent,
  defaultValue = '',
  ...props
}) => {
  const comments = useReportCommentsStore((store) => store.comments)
  const setComment = useReportCommentsStore((store) => store.setComment)
  const comment = comments[reportId] || ''

  const { t } = useTranslation()

  const handleChangeComment = (value: string) => {
    setComment(reportId, value)
  }

  useEffect(() => {
    if (!useReportCommentsStore.getState().comments[reportId]) {
      setComment(reportId, defaultValue)
    }
  }, [defaultValue, reportId, setComment])

  return (
    <DialogTrigger {...props}>
      <Button
        IconStart={Download}
        variant="ghost"
      >
        {buttonText}
      </Button>
      <DialogOverlay>
        <DialogContent className="w-full max-w-xl flex flex-col">
          <DialogHeader className="pb-5 border-b border-slate-200">
            <DialogTitle>{reportTitle}</DialogTitle>
          </DialogHeader>
          <div className="-mx-5 px-5 flex-1 overflow-y-auto scrollbar">
            <div className="py-4 space-y-2.5">
              {beforeContent}
              <FormElementUncontrolled
                direction="column"
                label={t('comment')}
              >
                <Textarea
                  spellCheck={false}
                  rows={8}
                  className="scrollbar"
                  value={comment}
                  onChange={(e) => handleChangeComment(e.target.value)}
                />
              </FormElementUncontrolled>
              {afterContent}
            </div>
          </div>
          <div className="grid place-content-center border-t border-slate-200 pt-5">
            {children({ comment })}
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
